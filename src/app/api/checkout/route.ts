import { NextRequest, NextResponse } from "next/server";
import { createOrder, type CheckoutCartItem } from "@/lib/checkoutStore";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      paymentMethod?: string;
      shippingAddress?: { email?: string; firstName: string; lastName: string; address: string; city: string; zipCode: string };
      cartItems?: CheckoutCartItem[];
      total?: number;
    };
    const { shippingAddress, cartItems, total } = body;

    // --- Validation ---
    if (!shippingAddress || !cartItems) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Demo-only checkout flow: create a local order record and return a fake confirmation.

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const orderTotal = typeof total === "number" ? total : subtotal + tax;

    // Simulate secure order creation
    const order = createOrder({
      userId: "guest",
      email: shippingAddress.email || "guest@shop.com",
      paymentMethod: "demo",
      shippingAddress,
      cartItems,
      subtotal,
      tax,
      total: orderTotal,
    });

    // Return the order to the frontend
    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        status: "created",
        demo_link: "/checkout/success?orderId=DEMO_TOKEN" 
      } 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
