import type { NextApiRequest, NextApiResponse } from "next";

// Contribution data types (kept identical to what GitHubHeatmap consumes)
interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubContributionsData {
  total: { [year: string]: number };
  contributions: ContributionDay[];
}

interface ErrorResponse {
  error: string;
}

// GraphQL response shape
interface GraphQLContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface GraphQLResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: GraphQLContributionDay[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
}

// Cache for server-side
const serverCache = new Map<
  string,
  { data: GitHubContributionsData; timestamp: number }
>();
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

// GitHub returns a quartile enum, the heatmap expects 0-4
const LEVEL_MAP: { [key: string]: number } = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const CONTRIBUTIONS_QUERY = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

async function fetchYearContributions(
  username: string,
  year: number
): Promise<GitHubContributionsData> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "personal-portfolio",
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: {
        login: username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL responded with ${response.status}`);
  }

  const json: GraphQLResponse = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  const calendar = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) {
    throw new Error(`No contribution data for user "${username}"`);
  }

  const contributions: ContributionDay[] = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVEL_MAP[day.contributionLevel] ?? 0,
    }))
  );

  return {
    total: { [String(year)]: calendar.totalContributions },
    contributions,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitHubContributionsData | ErrorResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const username = Array.isArray(req.query.username)
    ? req.query.username[0]
    : req.query.username;
  const yearParam = Array.isArray(req.query.year)
    ? req.query.year[0]
    : req.query.year;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
  if (!Number.isInteger(year) || year < 2008 || year > 2100) {
    return res.status(400).json({ error: "Invalid year" });
  }

  if (!process.env.GITHUB_TOKEN) {
    return res
      .status(500)
      .json({ error: "GITHUB_TOKEN is not configured on the server" });
  }

  const cacheKey = `${username}_${year}`;
  const cached = serverCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=1800");
    return res.status(200).json(cached.data);
  }

  try {
    const data = await fetchYearContributions(username, year);
    serverCache.set(cacheKey, { data, timestamp: Date.now() });
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=1800");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    // Serve stale cache rather than blanking the heatmap
    if (cached) {
      return res.status(200).json(cached.data);
    }
    return res.status(502).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch GitHub contributions",
    });
  }
}
