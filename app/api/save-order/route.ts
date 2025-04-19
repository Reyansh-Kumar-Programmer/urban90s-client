import { NextResponse } from "next/server";
import { client } from "@/utils/sanityClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received order:", body);

    const { customerName, customerEmail, products } = body;

    const sanityProducts = products.map((item: any) => ({
      _key: uuidv4(),
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      size: item.size,
    }));

    await client.create({
      _type: "order",
      customerName,
      customerEmail,
      status: "pending",
      products: sanityProducts,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order saving failed:", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
