// Works data type definition
export interface WorkItem {
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  features: string[];
  desc?: string;
  download_url?: string;
  function?: {
    name: string;
    img1: string;
    img2?: string;
    img3?: string;
  }[];
}

// Works data
export const worksData: WorkItem[] = [
  {
    title: "austin's web",
    description:
      "Personal introduction website based on Next.js development, simply introducing myself, with great songs and videos!!!!.",
    image: "/images/work1.jpg",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    link: "#",
    features: ["Personal Introduction", "Portfolio", "Interests", "Comments"],
  },
];
