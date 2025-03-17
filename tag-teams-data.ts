export type TagTeam = {
  id: string
  name: string
  members: string[]
  championships: string[]
}

export const defaultTagTeams: TagTeam[] = [
  {
    id: "new-day",
    name: "The New Day",
    members: [],
    championships: [],
  },
  {
    id: "usos",
    name: "The Usos",
    members: [],
    championships: [],
  },
]

