import { NextResponse } from "next/server";
import { client } from "../../../utils/sanityClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received order:", body);

    const { customerName, customerEmail, phoneNumber, address, products, status } = body;

    const sanityProducts = products.map((item: any) => ({
      _key: uuidv4(),
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      size: item.size,
    }));

    const orderNumber = uuidv4(); // Unique order ID
    const orderDate = new Date().toISOString(); // ISO formatted datetime

    await client.create({
      _type: "order",
      customerName,
      customerEmail,
      phoneNumber, // Include phone number
      address, // Include address
      orderNumber,
      orderDate,
      status: status || "pending",
      products: sanityProducts,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order saving failed:", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
