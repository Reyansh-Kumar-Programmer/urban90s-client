import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req) {
  try {
    // Get the items and email from the request body
    const { items, email } = await req.json();

    // Check if required fields are present
    if (!items || !email) {
      return NextResponse.json({ error: "Missing items or email" }, { status: 400 });
    }

    // Prepare line items for Stripe checkout
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr", // The currency code for the transaction
        product_data: {
          name: item.title, // Product name
          images: [item.image], // Product image
        },
        unit_amount: item.price * 100, // Price in the smallest currency unit (paise)
      },
      quantity: item.quantity, // Quantity of the product
    }));

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Allow only card payments
      line_items, // The list of products the customer is purchasing
      mode: "payment", // Indicates it's a payment session
      success_url: `${req.headers.get("origin")}/success`, // URL to redirect after payment success
      cancel_url: `${req.headers.get("origin")}/cart`, // URL to redirect after payment failure
      customer_email: email, // The customer's email address

      // Collect shipping address and phone number on the checkout screen
      shipping_address_collection: {
        allowed_countries: ["IN", "US"], // Allow shipping addresses from India and US (can be customized)
      },

      phone_number_collection: {
        enabled: true, // Enable phone number collection
      },
    });

    // Return the URL of the created checkout session
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);

    // Return more detailed error
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}