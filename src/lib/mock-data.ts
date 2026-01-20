import { NicheResult } from "./types";

export const mockNicheResults: NicheResult[] = [
  {
    id: "1",
    name: "Nigerian Street Food Reviews",
    saturation: "open",
    saturationLabel: "Open lane",
    why: "Most food content focuses on home cooking. Street food tours are rare but get massive engagement!",
    twists: [
      "Rate suya spots across different states",
      "Challenge: Eating at the cheapest vs most expensive buka",
      "Secret menu items at local fast food joints",
      "Morning street food routines in different cities",
    ],
    cardGradient: "card-gradient-2",
  },
  {
    id: "2",
    name: "Tech Reviews in Pidgin",
    saturation: "open",
    saturationLabel: "Hidden gem",
    why: "Tech content in English is everywhere. Pidgin tech reviews connect with a huge underserved audience!",
    twists: [
      "Phone reviews but make it relatable - 'This battery go carry you'",
      "Cheapest gadgets that actually work for Naija light situation",
      "Tech tips your uncle needs to hear",
      "Unboxing with honest Pidgin commentary",
    ],
    cardGradient: "card-gradient-4",
  },
  {
    id: "3",
    name: "Lagos Comedy Skits",
    saturation: "crowded",
    saturationLabel: "Very crowded",
    why: "This lane is packed! Everyone's doing the same 'African parent' and 'Lagos traffic' jokes. Time to pivot.",
    twists: [
      "Focus on lesser-shown areas like Epe or Ikorodu life",
      "Corporate Lagos humor from an intern's POV",
      "Dating in Lagos but from the talking stage only",
      "Things only night-shift workers in Lagos understand",
    ],
    cardGradient: "card-gradient-3",
  },
  {
    id: "4",
    name: "Budget Fashion Styling",
    saturation: "busy",
    saturationLabel: "Getting busy",
    why: "Fashion content is growing, but budget-focused styling with local market finds still has room!",
    twists: [
      "Style entire outfits under 10k from Yaba Market",
      "Thrift flip challenges - before & after reveals",
      "How to dress for Lagos heat and still look corporate",
      "Building a capsule wardrobe from Balogun Market",
    ],
    cardGradient: "card-gradient-1",
  },
  {
    id: "5",
    name: "Nigerian History Stories",
    saturation: "open",
    saturationLabel: "Lots of room!",
    why: "Educational content about Nigeria's rich history is severely lacking. People are hungry for this!",
    twists: [
      "The real story behind famous Nigerian landmarks",
      "Pre-colonial kingdoms explained with animations",
      "Nigerian heroes your school didn't teach you about",
      "The history behind popular Nigerian names and phrases",
    ],
    cardGradient: "card-gradient-5",
  },
  {
    id: "6",
    name: "Relationship Advice",
    saturation: "crowded",
    saturationLabel: "Very crowded",
    why: "Everyone's a relationship coach now. Standing out here requires a very unique angle.",
    twists: [
      "Focus only on situationships - the talking stage content",
      "Relationship advice but for long-distance Nigerian couples abroad",
      "Interview real couples who've been married 20+ years",
      "Dating culture differences across Nigerian ethnic groups",
    ],
    cardGradient: "card-gradient-6",
  },
  {
    id: "7",
    name: "Side Hustle Tutorials",
    saturation: "busy",
    saturationLabel: "Getting busy",
    why: "Money content always does well, but specific how-to guides for Nigerian realities still have gaps.",
    twists: [
      "How to actually start a POS business - real numbers",
      "Remote work opportunities that pay in dollars",
      "Turning your car into multiple income streams",
      "Weekend-only businesses for 9-5 workers",
    ],
    cardGradient: "card-gradient-4",
  },
  {
    id: "8",
    name: "Mental Health Awareness",
    saturation: "open",
    saturationLabel: "Open lane",
    why: "Despite growing need, culturally-relevant mental health content in Nigeria is still rare and needed!",
    twists: [
      "Breaking down therapy myths in Nigerian context",
      "Managing anxiety during NEPA/fuel scarcity stress",
      "How to talk to Nigerian parents about mental health",
      "Self-care that doesn't require spending money",
    ],
    cardGradient: "card-gradient-2",
  },
];

export function getResultsForQuery(query: string): NicheResult[] {
  // In a real app, this would call an API
  // For now, return shuffled mock data based on query
  const shuffled = [...mockNicheResults].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6 + Math.floor(Math.random() * 3));
}
