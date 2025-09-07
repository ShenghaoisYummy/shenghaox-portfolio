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
    name: "H.A.M Technology",
    position: "Full-Stack Developer",
    date: "2021-2023",
    description:
      "Full-stack developer focused on web applications and backend systems. Worked with React, Node.js, and database design.",
  },
  {
    name: "TechCorp Solutions",
    position: "Software Engineer",
    date: "2023-2024",
    description:
      "Software engineer developing scalable solutions and improving system performance. Experience with cloud technologies and DevOps practices.",
  },
  {
    name: "InnovateLab",
    position: "Senior Developer",
    date: "2024-Present",
    description:
      "Senior developer leading projects and mentoring junior developers. Specialized in modern frameworks and AI integration.",
  },
  {
    name: "StartupX",
    position: "Lead Frontend Developer",
    date: "2020-2021",
    description:
      "Led the development of responsive web applications using React and TypeScript. Collaborated with design team to create intuitive user interfaces.",
  },
  {
    name: "DataFlow Inc",
    position: "Backend Developer",
    date: "2019-2020",
    description:
      "Developed RESTful APIs and microservices using Node.js and Python. Implemented database optimization strategies and cloud deployment solutions.",
  },
  {
    name: "WebCraft Agency",
    position: "Junior Developer",
    date: "2018-2019",
    description:
      "Worked on client projects involving custom CMS development, e-commerce solutions, and responsive web design. Gained experience with various web technologies.",
  },
  {
    name: "FreelancePro",
    position: "Freelance Developer",
    date: "2017-2018",
    description:
      "Provided web development services to small businesses and startups. Created custom websites, landing pages, and web applications tailored to client needs.",
  },
];
