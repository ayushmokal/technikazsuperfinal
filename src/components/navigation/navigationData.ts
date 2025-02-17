import { categories } from "@/types/blog";

export const navigationCategories = [
  {
    id: "home",
    name: "HOME",
    path: "/",
    subcategories: [],
  },
  {
    id: "games",
    name: "GAMES", 
    path: "/games",
    subcategories: categories.GAMES,
  },
  {
    id: "tech",
    name: "TECH",
    path: "/tech", 
    subcategories: categories.TECH,
  },
  {
    id: "entertainment",
    name: "ENTERTAINMENT",
    path: "/entertainment",
    subcategories: categories.ENTERTAINMENT,
  },
  {
    id: "gadgets",
    name: "GADGETS",
    path: "/gadgets",
    subcategories: categories.GADGETS,
  },
  {
    id: "stocks",
    name: "STOCKS",
    path: "/stocks",
    subcategories: categories.STOCKS,
  },
];