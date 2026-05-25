export const partners = [
  {
    id: "1",
    name: "UNICEF",
    logo: null,
    description: "United Nations Children's Fund - Supporting children's rights and development worldwide.",
    contactPerson: "Dr. Sarah Johnson",
    website: "https://unicef.org",
    projectsSupported: ["Education for All", "Clean Water Initiative"],
  },
  {
    id: "2",
    name: "WHO",
    logo: null,
    description: "World Health Organization - Leading global health initiatives and policy.",
    contactPerson: "Dr. Michael Chen",
    website: "https://who.int",
    projectsSupported: ["Community Health Centers"],
  },
  {
    id: "3",
    name: "WaterAid",
    logo: null,
    description: "International nonprofit focused on water, sanitation, and hygiene.",
    contactPerson: "Emma Williams",
    website: "https://wateraid.org",
    projectsSupported: ["Clean Water Initiative"],
  },
  {
    id: "4",
    name: "Save the Children",
    logo: null,
    description: "Promoting children's rights and providing relief and support.",
    contactPerson: "Robert Taylor",
    website: "https://savethechildren.org",
    projectsSupported: ["Education for All"],
  },
  {
    id: "5",
    name: "UN Women",
    logo: null,
    description: "UN entity for gender equality and women empowerment.",
    contactPerson: "Maria Garcia",
    website: "https://unwomen.org",
    projectsSupported: ["Women Empowerment Program"],
  },
  {
    id: "6",
    name: "Red Cross",
    logo: null,
    description: "Humanitarian organization providing emergency assistance.",
    contactPerson: "James Anderson",
    website: "https://redcross.org",
    projectsSupported: ["Emergency Relief Fund"],
  },
  {
    id: "7",
    name: "FAO",
    logo: null,
    description: "Food and Agriculture Organization - Fighting hunger and poverty.",
    contactPerson: "Dr. Li Wei",
    website: "https://fao.org",
    projectsSupported: ["Agricultural Training Program"],
  },
  {
    id: "8",
    name: "Microsoft Philanthropies",
    logo: null,
    description: "Technology for social impact and digital inclusion.",
    contactPerson: "David Kim",
    website: "https://microsoft.com/philanthropies",
    projectsSupported: ["Digital Literacy Initiative"],
  },
]

export const sponsors = [
  {
    id: "1",
    name: "GlobalTech",
    logo: null,
    tier: "platinum",
    description: "Leading technology solutions provider committed to social responsibility.",
    contributionAreas: ["Health", "Education", "Digital Literacy"],
  },
  {
    id: "2",
    name: "EcoVentures",
    logo: null,
    tier: "platinum",
    description: "Sustainable investment firm focused on environmental and social impact.",
    contributionAreas: ["Water", "Agriculture", "Environment"],
  },
  {
    id: "3",
    name: "HealthFirst",
    logo: null,
    tier: "gold",
    description: "Healthcare company dedicated to improving community health outcomes.",
    contributionAreas: ["Health", "Community Wellness"],
  },
  {
    id: "4",
    name: "EduCorp",
    logo: null,
    tier: "gold",
    description: "Education technology company supporting learning initiatives.",
    contributionAreas: ["Education", "Digital Literacy"],
  },
  {
    id: "5",
    name: "GreenEnergy",
    logo: null,
    tier: "gold",
    description: "Renewable energy company powering sustainable development.",
    contributionAreas: ["Environment", "Agriculture"],
  },
  {
    id: "6",
    name: "CommUnity Bank",
    logo: null,
    tier: "silver",
    description: "Community-focused financial institution supporting local initiatives.",
    contributionAreas: ["Women Empowerment", "Economic Development"],
  },
  {
    id: "7",
    name: "FoodForAll",
    logo: null,
    tier: "silver",
    description: "Food distribution company fighting hunger in communities.",
    contributionAreas: ["Humanitarian Aid", "Nutrition"],
  },
  {
    id: "8",
    name: "BuildTogether",
    logo: null,
    tier: "silver",
    description: "Construction company building infrastructure for communities.",
    contributionAreas: ["Youth Development", "Infrastructure"],
  },
]

export const sponsorTiers = {
  platinum: {
    name: "Platinum",
    color: "bg-gradient-to-br from-gray-100 to-gray-200",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
  },
  gold: {
    name: "Gold",
    color: "bg-gradient-to-br from-amber-50 to-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
  },
  silver: {
    name: "Silver",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    textColor: "text-slate-600",
    borderColor: "border-slate-300",
  },
}

export type Partner = {
  id: string
  name: string
  logo: string | null
  description: string
  contactPerson: string
  website: string
  projectsSupported: string[]
}

export type Sponsor = {
  id: string
  name: string
  logo: string | null
  tier: string
  description: string
  contributionAreas: string[]
}
