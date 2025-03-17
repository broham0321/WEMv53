export type Championship = {
  id: string
  name: string
  description: string
  image?: string
  currentHolder?: string
  division: "Men's" | "Women's" | "Tag Team" | "Universal"
}

export const defaultChampionships: Championship[] = [
  {
    id: "wwe-championship",
    name: "WWE Championship",
    description: "The most prestigious title in sports entertainment",
    division: "Men's",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/WWE_Championship--1a1d43b9cb5c500dab3c231e57193f1a.png",
  },
  {
    id: "universal-championship",
    name: "Universal Championship",
    description: "The top championship on Raw",
    division: "Universal",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/Universal_Championship--3ce10a2c5396a9147d97307a2d2acca1.png",
  },
  {
    id: "intercontinental-championship",
    name: "Intercontinental Championship",
    description: "The workhorse championship",
    division: "Men's",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/IC_Championship--6b375cd71fdb3ad3628752437fda3882.png",
  },
  {
    id: "united-states-championship",
    name: "United States Championship",
    description: "Representing the United States of America",
    division: "Men's",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/US_Championship--f513adab8a44f775a7b7c70a2e2e9b67.png",
  },
  {
    id: "raw-womens-championship",
    name: "Raw Women's Championship",
    description: "The top women's championship on Raw",
    division: "Women's",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/RAW_Womens_Championship--6b82a9d6bb4b8c586f33e2a31b52ec83.png",
  },
  {
    id: "smackdown-womens-championship",
    name: "SmackDown Women's Championship",
    description: "The top women's championship on SmackDown",
    division: "Women's",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/SD_Womens_Championship--f5d762e4f2e98e0a07df1f40e0754636.png",
  },
  {
    id: "raw-tag-team-championship",
    name: "Raw Tag Team Championship",
    description: "The tag team championship on Raw",
    division: "Tag Team",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/RAW_Tag_Team_Championship--3e0cad8a8ecadf831b0211a076eaf19f.png",
  },
  {
    id: "smackdown-tag-team-championship",
    name: "SmackDown Tag Team Championship",
    description: "The tag team championship on SmackDown",
    division: "Tag Team",
    image:
      "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/SD_Tag_Team_Championship--3a6fbf48d9bd21b8ce281d8d91b7543b.png",
  },
]

