// Types for crew data
export interface CrewMember {
  id: number
  name: string
  role: string
  avatar: string
  onDuty: boolean
  experience: string
  languages: string[]
  assignedRooms: string[]
  email?: string
  phone?: string
  startDate?: string
  nationality?: string
  specialties?: string[]
  certifications?: string[]
  schedule?: DutySchedule[]
}

export interface DutySchedule {
  date: string
  shift: "morning" | "afternoon" | "night" | "off"
  startTime?: string
  endTime?: string
  location?: string
  notes?: string
}

// Mock data for crew members
export const crewData: CrewMember[] = [
  {
    id: 1,
    name: "Emma Wilson",
    role: "Chief Stewardess",
    avatar: "/confident-yacht-stewardess.png",
    onDuty: true,
    experience: "8 years",
    languages: ["English", "French", "Spanish"],
    assignedRooms: ["Master Cabin", "VIP Suite 1"],
    email: "emma.wilson@obedio.com",
    phone: "+33 6 12 34 56 78",
    startDate: "2019-03-15",
    nationality: "British",
    specialties: ["Wine Service", "Interior Management", "Guest Relations"],
    certifications: ["STCW", "Food Safety Level 2", "Wine & Spirit Education Trust Level 3"],
    schedule: [
      { date: "2023-04-10", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Main Deck" },
      { date: "2023-04-11", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Main Deck" },
      { date: "2023-04-12", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Upper Deck" },
      { date: "2023-04-13", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Upper Deck" },
      { date: "2023-04-14", shift: "off" },
      { date: "2023-04-15", shift: "off" },
      { date: "2023-04-16", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Main Deck" },
    ],
  },
  {
    id: 2,
    name: "James Miller",
    role: "Butler",
    avatar: "/distinguished-yacht-butler.png",
    onDuty: true,
    experience: "12 years",
    languages: ["English", "Italian"],
    assignedRooms: ["Salon", "Dining Room"],
    email: "james.miller@obedio.com",
    phone: "+33 6 23 45 67 89",
    startDate: "2018-06-10",
    nationality: "American",
    specialties: ["Silver Service", "Cocktail Mixing", "Formal Service"],
    certifications: ["STCW", "Butler Academy Certificate", "Mixology Level 2"],
    schedule: [
      { date: "2023-04-10", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Main Salon" },
      { date: "2023-04-11", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Main Salon" },
      { date: "2023-04-12", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Dining Room" },
      { date: "2023-04-13", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Dining Room" },
      { date: "2023-04-14", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Main Salon" },
      { date: "2023-04-15", shift: "off" },
      { date: "2023-04-16", shift: "off" },
    ],
  },
  {
    id: 3,
    name: "Sophia Clark",
    role: "Stewardess",
    avatar: "/polished-professional.png",
    onDuty: false,
    experience: "3 years",
    languages: ["English", "Russian"],
    assignedRooms: ["Guest Cabin 1", "Guest Cabin 2"],
    email: "sophia.clark@obedio.com",
    phone: "+33 6 34 56 78 90",
    startDate: "2021-05-20",
    nationality: "Canadian",
    specialties: ["Housekeeping", "Laundry", "Table Setting"],
    certifications: ["STCW", "Food Handling Certificate"],
    schedule: [
      { date: "2023-04-10", shift: "off" },
      { date: "2023-04-11", shift: "off" },
      { date: "2023-04-12", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Guest Cabins" },
      { date: "2023-04-13", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Guest Cabins" },
      { date: "2023-04-14", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Guest Cabins" },
      { date: "2023-04-15", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Main Deck" },
      { date: "2023-04-16", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Main Deck" },
    ],
  },
  {
    id: 4,
    name: "Daniel Roberts",
    role: "Captain",
    avatar: "/confident-captain.png",
    onDuty: true,
    experience: "15 years",
    languages: ["English", "Greek"],
    assignedRooms: ["Bridge", "Captain's Quarters"],
    email: "daniel.roberts@obedio.com",
    phone: "+33 6 45 67 89 01",
    startDate: "2017-01-10",
    nationality: "Greek",
    specialties: ["Navigation", "Crew Management", "Guest Relations"],
    certifications: ["Master 3000GT", "GMDSS", "Advanced Sea Survival"],
    schedule: [
      { date: "2023-04-10", shift: "morning", startTime: "06:00", endTime: "18:00", location: "Bridge" },
      { date: "2023-04-11", shift: "morning", startTime: "06:00", endTime: "18:00", location: "Bridge" },
      { date: "2023-04-12", shift: "off" },
      { date: "2023-04-13", shift: "off" },
      { date: "2023-04-14", shift: "morning", startTime: "06:00", endTime: "18:00", location: "Bridge" },
      { date: "2023-04-15", shift: "morning", startTime: "06:00", endTime: "18:00", location: "Bridge" },
      { date: "2023-04-16", shift: "morning", startTime: "06:00", endTime: "18:00", location: "Bridge" },
    ],
  },
  {
    id: 5,
    name: "Olivia Johnson",
    role: "Chef",
    avatar: "/culinary-captain.png",
    onDuty: false,
    experience: "10 years",
    languages: ["English", "French"],
    assignedRooms: ["Galley"],
    email: "olivia.johnson@obedio.com",
    phone: "+33 6 56 78 90 12",
    startDate: "2019-08-15",
    nationality: "French",
    specialties: ["Fine Dining", "Pastry", "Dietary Restrictions"],
    certifications: ["Culinary Arts Degree", "Food Safety Level 3", "Wine Pairing Certificate"],
    schedule: [
      { date: "2023-04-10", shift: "morning", startTime: "06:00", endTime: "14:00", location: "Galley" },
      { date: "2023-04-11", shift: "morning", startTime: "06:00", endTime: "14:00", location: "Galley" },
      { date: "2023-04-12", shift: "afternoon", startTime: "14:00", endTime: "22:00", location: "Galley" },
      { date: "2023-04-13", shift: "afternoon", startTime: "14:00", endTime: "22:00", location: "Galley" },
      { date: "2023-04-14", shift: "off" },
      { date: "2023-04-15", shift: "off" },
      { date: "2023-04-16", shift: "morning", startTime: "06:00", endTime: "14:00", location: "Galley" },
    ],
  },
  {
    id: 6,
    name: "William Thompson",
    role: "Deckhand",
    avatar: "/placeholder.svg?height=200&width=200&query=portrait%20of%20professional%20yacht%20deckhand",
    onDuty: false,
    experience: "5 years",
    languages: ["English"],
    assignedRooms: ["Sun Deck", "Beach Club"],
    email: "william.thompson@obedio.com",
    phone: "+33 6 67 89 01 23",
    startDate: "2020-03-01",
    nationality: "Australian",
    specialties: ["Water Sports", "Tender Operations", "Deck Maintenance"],
    certifications: ["STCW", "Powerboat Level 2", "Jet Ski Instructor"],
    schedule: [
      { date: "2023-04-10", shift: "off" },
      { date: "2023-04-11", shift: "off" },
      { date: "2023-04-12", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Exterior Decks" },
      { date: "2023-04-13", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Exterior Decks" },
      { date: "2023-04-14", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Beach Club" },
      { date: "2023-04-15", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Exterior Decks" },
      { date: "2023-04-16", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Exterior Decks" },
    ],
  },
  {
    id: 7,
    name: "Charlotte Davis",
    role: "Stewardess",
    avatar:
      "/placeholder.svg?height=200&width=200&query=portrait%20of%20professional%20female%20yacht%20stewardess%20blonde",
    onDuty: true,
    experience: "2 years",
    languages: ["English", "Spanish"],
    assignedRooms: ["Guest Cabin 3", "Guest Cabin 4"],
    email: "charlotte.davis@obedio.com",
    phone: "+33 6 78 90 12 34",
    startDate: "2022-01-15",
    nationality: "Spanish",
    specialties: ["Housekeeping", "Flower Arranging", "Cocktail Service"],
    certifications: ["STCW", "Interior Yacht Service Course"],
    schedule: [
      { date: "2023-04-10", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Guest Cabins" },
      { date: "2023-04-11", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Guest Cabins" },
      { date: "2023-04-12", shift: "off" },
      { date: "2023-04-13", shift: "off" },
      { date: "2023-04-14", shift: "afternoon", startTime: "15:00", endTime: "23:00", location: "Guest Cabins" },
      { date: "2023-04-15", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Guest Cabins" },
      { date: "2023-04-16", shift: "morning", startTime: "07:00", endTime: "15:00", location: "Guest Cabins" },
    ],
  },
  {
    id: 8,
    name: "Michael Anderson",
    role: "Engineer",
    avatar: "/placeholder.svg?height=200&width=200&query=portrait%20of%20professional%20yacht%20engineer",
    onDuty: true,
    experience: "9 years",
    languages: ["English", "German"],
    assignedRooms: ["Engine Room", "Technical Spaces"],
    email: "michael.anderson@obedio.com",
    phone: "+33 6 89 01 23 45",
    startDate: "2019-05-10",
    nationality: "German",
    specialties: ["Mechanical Systems", "Electrical Systems", "Water Makers"],
    certifications: ["Y4 Engineering", "STCW", "Refrigeration Systems"],
    schedule: [
      { date: "2023-04-10", shift: "morning", startTime: "08:00", endTime: "20:00", location: "Engine Room" },
      { date: "2023-04-11", shift: "off" },
      { date: "2023-04-12", shift: "off" },
      { date: "2023-04-13", shift: "morning", startTime: "08:00", endTime: "20:00", location: "Engine Room" },
      { date: "2023-04-14", shift: "morning", startTime: "08:00", endTime: "20:00", location: "Engine Room" },
      { date: "2023-04-15", shift: "morning", startTime: "08:00", endTime: "20:00", location: "Engine Room" },
      { date: "2023-04-16", shift: "off" },
    ],
  },
]

// Crew roles for filtering
export const crewRoles = [
  "All Roles",
  "Chief Stewardess",
  "Stewardess",
  "Butler",
  "Captain",
  "Chef",
  "Deckhand",
  "Engineer",
]

// Shift patterns
export const shiftPatterns = [
  { id: "standard", name: "Standard (8 hours)", description: "8-hour shift with regular rotation" },
  { id: "extended", name: "Extended (12 hours)", description: "12-hour shift for key positions" },
  { id: "split", name: "Split Shift", description: "Two 4-hour periods with break in between" },
  { id: "night", name: "Night Watch", description: "Overnight duty from 23:00 to 07:00" },
  { id: "custom", name: "Custom", description: "Customized shift hours" },
]

// Rotation templates
export const rotationTemplates = [
  { id: "4-2", name: "4 on, 2 off", description: "Work 4 days, rest 2 days" },
  { id: "7-7", name: "Week on, week off", description: "Work 7 days, rest 7 days" },
  { id: "5-2", name: "Weekday", description: "Work Monday-Friday, weekend off" },
  { id: "2-2-3", name: "2-2-3 Rotation", description: "2 days on, 2 days off, 3 days on, etc." },
  { id: "custom", name: "Custom Pattern", description: "Custom rotation pattern" },
]

// Yacht locations for duty assignments
export const yachtLocations = [
  "Main Deck",
  "Upper Deck",
  "Sun Deck",
  "Bridge",
  "Engine Room",
  "Galley",
  "Crew Mess",
  "Guest Cabins",
  "Master Suite",
  "Salon",
  "Dining Room",
  "Beach Club",
  "Tender Garage",
  "Exterior Decks",
]
