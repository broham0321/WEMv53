export type MatchType = {
  id: string
  name: string
  description: string
  category: "Match" | "Promo" | "Other"
}

export const defaultMatchTypes: MatchType[] = [
  {
    id: "singles",
    name: "Singles Match",
    description: "Standard one-on-one match",
    category: "Match",
  },
  {
    id: "tag-team",
    name: "Tag Team Match",
    description: "Two teams of two wrestlers",
    category: "Match",
  },
  {
    id: "triple-threat",
    name: "Triple Threat",
    description: "Three wrestlers compete against each other",
    category: "Match",
  },
  {
    id: "fatal-four-way",
    name: "Fatal Four-Way",
    description: "Four wrestlers compete against each other",
    category: "Match",
  },
  {
    id: "ladder",
    name: "Ladder Match",
    description: "Wrestlers must climb a ladder to retrieve an object suspended above the ring",
    category: "Match",
  },
  {
    id: "tlc",
    name: "Tables, Ladders, and Chairs",
    description: "No disqualification match involving tables, ladders, and chairs",
    category: "Match",
  },
  {
    id: "steel-cage",
    name: "Steel Cage Match",
    description: "Match takes place inside a steel cage",
    category: "Match",
  },
  {
    id: "hell-in-a-cell",
    name: "Hell in a Cell",
    description: "Match takes place inside a roofed steel cage",
    category: "Match",
  },
  {
    id: "royal-rumble",
    name: "Royal Rumble",
    description: "30-person over-the-top-rope elimination match",
    category: "Match",
  },
  {
    id: "elimination-chamber",
    name: "Elimination Chamber",
    description: "Match takes place inside the Elimination Chamber structure",
    category: "Match",
  },
  // Add default promo types
  {
    id: "in-ring-promo",
    name: "In-Ring Promo",
    description: "Wrestler speaks to the audience from inside the ring",
    category: "Promo",
  },
  {
    id: "backstage-interview",
    name: "Backstage Interview",
    description: "Wrestler is interviewed backstage",
    category: "Promo",
  },
  {
    id: "talk-show",
    name: "Talk Show Segment",
    description: "Hosted talk show segment (e.g., Miz TV, Highlight Reel)",
    category: "Promo",
  },
  {
    id: "contract-signing",
    name: "Contract Signing",
    description: "Wrestlers sign a contract for an upcoming match",
    category: "Promo",
  },
  {
    id: "championship-celebration",
    name: "Championship Celebration",
    description: "Wrestler celebrates winning a championship",
    category: "Promo",
  },
]

export type PromoType = {
  id: string
  name: string
  description: string
}

export const defaultPromoTypes: PromoType[] = [
  {
    id: "face-promo",
    name: "Face Promo",
    description: "Positive promo to get the crowd behind the wrestler",
  },
  {
    id: "heel-promo",
    name: "Heel Promo",
    description: "Negative promo to get the crowd to boo the wrestler",
  },
  {
    id: "challenge",
    name: "Challenge",
    description: "Wrestler challenges another wrestler to a match",
  },
  {
    id: "celebration",
    name: "Celebration",
    description: "Wrestler celebrates a victory or achievement",
  },
  {
    id: "interruption",
    name: "Interruption",
    description: "Wrestler interrupts another wrestler's promo",
  },
]

export type Brand = {
  id: string
  name: string
  color: string
}

export const defaultBrands: Brand[] = [
  {
    id: "raw",
    name: "Raw",
    color: "bg-red-600",
  },
  {
    id: "smackdown",
    name: "SmackDown",
    color: "bg-blue-600",
  },
  {
    id: "nxt",
    name: "NXT",
    color: "bg-yellow-500",
  },
  {
    id: "free-agent",
    name: "Free Agent",
    color: "bg-gray-500",
  },
]

