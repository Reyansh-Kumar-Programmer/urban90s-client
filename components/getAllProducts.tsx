// lib/sanity/getAllProducts.ts
import { client } from "@/utils/sanityClient"; // adjust path if needed

export const getAllProducts = async () => {
  const query = `*[_type == "product"]{ _id, title, slug }`;
  return await client.fetch(query);
};
