export interface User {
  id: string
  name: string
  avatar: string
  location: string
  bio: string
}

export interface Skill {
  id: string
  userId: string
  user: User
  offering: string
  offeringCategory: string
  seeking: string
  seekingCategory: string
  description: string
  level: "Beginner" | "Intermediate" | "Advanced"
  availability: string
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/professional-woman.png",
    location: "San Francisco, CA",
    bio: "Passionate about learning and sharing knowledge with the community.",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    avatar: "/professional-man.png",
    location: "Austin, TX",
    bio: "Always excited to exchange skills and meet new people.",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    avatar: "/creative-woman.png",
    location: "Brooklyn, NY",
    bio: "Creative soul looking to expand my skillset through collaboration.",
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "/man-developer.png",
    location: "Seattle, WA",
    bio: "Tech enthusiast who loves teaching and learning new things.",
  },
  {
    id: "5",
    name: "Priya Patel",
    avatar: "/woman-teacher-classroom.png",
    location: "Chicago, IL",
    bio: "Believer in the power of community-driven learning.",
  },
  {
    id: "6",
    name: "Alex Thompson",
    avatar: "/person-musician.jpg",
    location: "Portland, OR",
    bio: "Music teacher by day, lifelong learner always.",
  },
]

export const mockSkills: Skill[] = [
  {
    id: "1",
    userId: "1",
    user: mockUsers[0],
    offering: "Web Development",
    offeringCategory: "Technology",
    seeking: "Guitar Lessons",
    seekingCategory: "Music",
    description:
      "I can teach modern web development with React, Next.js, and TypeScript. Looking to learn acoustic guitar from scratch.",
    level: "Advanced",
    availability: "Weekends",
  },
  {
    id: "2",
    userId: "2",
    user: mockUsers[1],
    offering: "Photography",
    offeringCategory: "Creative",
    seeking: "Spanish Language",
    seekingCategory: "Language",
    description:
      "Professional photographer specializing in portraits and events. Want to learn conversational Spanish for travel.",
    level: "Advanced",
    availability: "Evenings",
  },
  {
    id: "3",
    userId: "3",
    user: mockUsers[2],
    offering: "Graphic Design",
    offeringCategory: "Creative",
    seeking: "Yoga Instruction",
    seekingCategory: "Fitness",
    description:
      "Experienced graphic designer with Adobe Creative Suite expertise. Seeking beginner-friendly yoga instruction.",
    level: "Intermediate",
    availability: "Flexible",
  },
  {
    id: "4",
    userId: "4",
    user: mockUsers[3],
    offering: "Python Programming",
    offeringCategory: "Technology",
    seeking: "Cooking Classes",
    seekingCategory: "Culinary",
    description: "Software engineer teaching Python and data science. Would love to learn Italian cooking techniques.",
    level: "Advanced",
    availability: "Weekdays",
  },
  {
    id: "5",
    userId: "5",
    user: mockUsers[4],
    offering: "Piano Lessons",
    offeringCategory: "Music",
    seeking: "Digital Marketing",
    seekingCategory: "Business",
    description: "Classical piano teacher with 10 years experience. Looking to learn social media marketing and SEO.",
    level: "Advanced",
    availability: "Afternoons",
  },
  {
    id: "6",
    userId: "6",
    user: mockUsers[5],
    offering: "Guitar Lessons",
    offeringCategory: "Music",
    seeking: "Web Development",
    seekingCategory: "Technology",
    description:
      "Teaching acoustic and electric guitar for all levels. Want to build my own website and learn web development.",
    level: "Intermediate",
    availability: "Weekends",
  },
  {
    id: "7",
    userId: "1",
    user: mockUsers[0],
    offering: "UI/UX Design",
    offeringCategory: "Creative",
    seeking: "French Language",
    seekingCategory: "Language",
    description:
      "Product designer with expertise in user research and interface design. Seeking French conversation practice.",
    level: "Intermediate",
    availability: "Evenings",
  },
  {
    id: "8",
    userId: "2",
    user: mockUsers[1],
    offering: "Woodworking",
    offeringCategory: "Crafts",
    seeking: "Video Editing",
    seekingCategory: "Creative",
    description: "Furniture maker teaching basic to intermediate woodworking. Want to learn video editing for YouTube.",
    level: "Intermediate",
    availability: "Weekends",
  },
]

export const categories = [
  "All",
  "Technology",
  "Music",
  "Creative",
  "Language",
  "Fitness",
  "Culinary",
  "Business",
  "Crafts",
]
