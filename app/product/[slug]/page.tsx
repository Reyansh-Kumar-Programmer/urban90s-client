// app/product/[slug]/page.tsx
import { client } from "@/utils/sanityClient";
import ProductViewer from "./ProductViewer";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: Props) {
  const { slug } = params; // ✅ DO NOT USE await here

  const query = `*[_type == "product" && slug.current == $slug][0]{
    title,
    price,
    originalPrice,
    "previewImage": previewImage.asset->url,
    "images": images[].asset->url,
    sizes
  }`;

  const product = await client.fetch(query, { slug });

  if (!product) return notFound();

  return <ProductViewer product={product} />;
}
