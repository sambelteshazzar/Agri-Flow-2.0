import { UserProfile, ChartDataPoint } from '../types';

export const GUEST_USER: UserProfile = {
  name: "Guest Farmer",
  role: "Visitor",
  farmName: "Demo Farm",
  avatar: "/stock/user.svg",
  bio: "Exploring the AgriFlow platform. Sign in to access your farm dashboard and market prices.",
  followers: 0,
  following: 0,
  posts: 0,
  countryCode: "",
  currencyCode: "USD",
  currencySymbol: "$",
  language: "en",
  region: "",
  farmType: "mixed",
  areaUnit: "ha",
  climateZone: "temperate",
  phoneNumber: "",
  location: ""
};

export const YIELD_DATA: ChartDataPoint[] = [
  { name: '2020', value: 1520, cost: 685 },
  { name: '2021', value: 1610, cost: 780 },
  { name: '2022', value: 1580, cost: 920 },
  { name: '2023', value: 1654, cost: 1050 },
  { name: '2024', value: 1654, cost: 1180 },
  { name: '2025 (Est)', value: 1620, cost: 1200 },
  { name: '2026 (Fcast)', value: 1580, cost: 1280 },
];
