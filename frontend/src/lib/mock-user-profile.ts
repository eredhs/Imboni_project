import type { UserProfile } from "@/lib/job-seeker-profile-types";

export const mockUserProfile: UserProfile = {
  id: "user-seeker-1",
  firstName: "Stacy",
  lastName: "Mukashema",
  email: "stacy.mukashema@email.com",
  phone: "+250 788 234 567",
  location: "Kigali, Rwanda",
  headline: "Full-Stack Developer | React | Node.js | TypeScript",
  bio: "Passionate full-stack developer with 4 years of experience building web applications. Specialized in React and Node.js. Looking for opportunities to work on impactful projects with innovative teams.",
  profilePhoto: "U",
  availabilityStatus: "actively_looking",
  skills: [
    {
      id: "skill-1",
      name: "React",
      level: "expert",
      endorsements: 24,
      yearsOfExperience: 3,
    },
    {
      id: "skill-2",
      name: "Node.js",
      level: "expert",
      endorsements: 18,
      yearsOfExperience: 3,
    },
    {
      id: "skill-3",
      name: "TypeScript",
      level: "advanced",
      endorsements: 12,
      yearsOfExperience: 2,
    },
    {
      id: "skill-4",
      name: "MongoDB",
      level: "advanced",
      endorsements: 10,
      yearsOfExperience: 3,
    },
    {
      id: "skill-5",
      name: "AWS",
      level: "intermediate",
      endorsements: 6,
      yearsOfExperience: 1,
    },
    {
      id: "skill-6",
      name: "Git",
      level: "advanced",
      endorsements: 8,
      yearsOfExperience: 4,
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Rwanda",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: 2018,
      endYear: 2022,
      description:
        "Graduated with honors. Focus on software engineering and web development. Completed research on AI-driven user interfaces.",
    },
  ],
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Frontend Developer",
      company: "InnovateTech Rwanda",
      startDate: new Date(2024, 0, 15),
      isCurrent: true,
      description:
        "Led frontend development for multiple client projects. Mentored 2 junior developers. Improved application performance by 40% through optimization.",
      skills: ["React", "TypeScript", "JavaScript", "Tailwind CSS"],
    },
    {
      id: "exp-2",
      jobTitle: "Full-Stack Developer",
      company: "Skyline Solutions",
      startDate: new Date(2022, 5, 1),
      endDate: new Date(2024, 0, 10),
      isCurrent: false,
      description:
        "Developed and maintained multiple web applications using MERN stack. Collaborated with designers and backend developers to deliver high-quality features.",
      skills: ["React", "Node.js", "MongoDB", "Express", "AWS"],
    },
    {
      id: "exp-3",
      jobTitle: "Junior Developer",
      company: "TechStart Africa",
      startDate: new Date(2021, 8, 1),
      endDate: new Date(2022, 4, 30),
      isCurrent: false,
      description:
        "Started career as junior developer working on front-end components. Learned best practices and contributed to 5+ production applications.",
      skills: ["JavaScript", "React", "HTML", "CSS"],
    },
  ],
  portfolio: "stacymukashema.dev",
  linkedinProfile: "linkedin.com/in/stacymukashema",
  portfolioLinks: [
    {
      title: "Personal Website",
      url: "https://stacymukashema.dev",
    },
    {
      title: "GitHub",
      url: "https://github.com/stacymukashema",
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/stacymukashema",
    },
  ],
  notificationSettings: {
    emailNotifications: true,
    jobRecommendations: true,
    applicationUpdates: true,
    interviewReminders: true,
  },
  privacy: {
    profileVisibility: "recruiters_only",
    showPhoneNumber: false,
    showEmail: true,
  },
};
