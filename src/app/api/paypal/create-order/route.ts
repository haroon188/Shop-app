import { NextRequest, NextResponse } from "next/server";
import { createPaypalOrder, type PaypalCartItem } from "../../../../lib/paypal";

/**
 * Endpoint to securely start a real PayPal Order
 * No secrets are exposed here.
 */
export async function POST(req: NextRequest) {
  try {
    const { cartItems, total } = (await req.json()) as { cartItems?: PaypalCartItem[]; total?: number };

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Empty cart." }, { status: 400 });
    }

    const orderTotal = typeof total === "number" ? total : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await createPaypalOrder(cartItems, orderTotal);

    return NextResponse.json({ 
      id: order.id, 
      status: order.status 
    }, { status: 201 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create PayPal order:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
