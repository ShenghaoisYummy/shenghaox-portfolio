// Experience data type definition
export interface ExperienceItem {
  name: string;
  position: string;
  date: string;
  description: string;
}

// Experience data
export const experienceData: ExperienceItem[] = [
  {
    name: "Experience 3",
    position: "Senior Developer",
    date: "2024-Present",
    description:
      "Senior developer leading projects and mentoring junior developers. Specialized in modern frameworks and AI integration.",
  },
  {
    name: "Experience 2",
    position: "Software Engineer",
    date: "2023-2024",
    description:
      "Software engineer developing scalable solutions and improving system performance. Experience with cloud technologies and DevOps practices.",
  },
];
