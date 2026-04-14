import axios from "axios";

/** Axios instance without auth — used for public storefront chat so a logged-in seller is not treated as the buyer. */
const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export const publicApi = axios.create({
  baseURL,
  timeout: 15000,
});
