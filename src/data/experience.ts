// Experience data type definition
export interface ExperienceItem {
  name: string;
  position: string;
  date: string;
  description: string;
  techStack: string[];
  achievements: string[];
  responsibilities: string[];
  location?: string;
  companyUrl?: string;
}

// Experience data
export const experienceData: ExperienceItem[] = [
  {
    name: "LontonBlackwell Law Firm",
    position: "Software Engineer",
    date: "2025/09 - Present",
    description:
      "Architecting an AI-powered legal automation platform to process over 2,000 active cases daily. I designed a domain-driven backend using Node.js, TypeScript, and Express.js and integrated the Actionstep API with Google Gemini LLM to automate client communications and financial reporting. The system features OAuth 2.0 security, automated testing with Vitest, and a robust CI/CD pipeline.",
    techStack: [
      "Node.js",
      "TypeScript",
      "Express.js",
      "Google Gemini",
      "OAuth 2.0",
      "Vitest",
      "Actionstep API",
      "REST API",
    ],
    achievements: [
      "Processes 2,000+ active cases daily with automated workflows",
      "Reduced client communication response time by 75% through AI automation",
      "Implemented secure OAuth 2.0 authentication with 99.9% uptime",
      "Established comprehensive CI/CD pipeline with automated testing coverage",
    ],
    responsibilities: [
      "Design and architect domain-driven backend systems for legal automation",
      "Integrate Actionstep API with Google Gemini LLM for intelligent case processing",
      "Develop automated client communication and financial reporting systems",
      "Implement security measures including OAuth 2.0 authentication",
      "Establish and maintain CI/CD pipeline with automated testing using Vitest",
      "Collaborate with legal teams to understand automation requirements and optimize workflows",
    ],
    location: "Sydney, Australia",
    companyUrl: "https://longtonlegal.com.au",
  },
  {
    name: "H.A.M Technology",
    position: "Full-Stack Developer",
    date: "2021 - 2023",
    description:
      "Developed a short-term rental integration platform that increased client efficiency by 200%. I built scalable RESTful APIs using .NET Core and created dynamic, responsive front-end modules with React.js and Redux. The solution was deployed on AWS EC2 with S3 storage, supported by a comprehensive DevOps pipeline for automated testing and deployment.",
    techStack: [
      ".NET Core",
      "React.js",
      "Redux",
      "AWS EC2",
      "AWS S3",
      "RESTful API",
      "C#",
      "JavaScript",
      "SQL Server",
    ],
    achievements: [
      "Increased client operational efficiency by 200% through platform integration",
      "Built scalable RESTful APIs serving 10,000+ daily requests",
      "Created responsive front-end modules with React.js and Redux state management",
      "Successfully deployed production system on AWS infrastructure with 99.5% uptime",
    ],
    responsibilities: [
      "Develop and maintain short-term rental integration platform",
      "Design and implement scalable RESTful APIs using .NET Core",
      "Build dynamic, responsive front-end modules with React.js and Redux",
      "Deploy and manage applications on AWS EC2 with S3 storage",
      "Establish DevOps pipeline for automated testing and deployment",
      "Optimize database queries and performance for SQL Server",
    ],
    location: "Sydney, Australia",
  },
];
