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
    const { paymentMethod, shippingAddress, cartItems, total } = body;

    // --- Validation ---
    if (!paymentMethod || !shippingAddress || !cartItems) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (paymentMethod !== "paypal") {
      return NextResponse.json({ error: "Only PayPal is supported for this demo" }, { status: 400 });
    }

    // --- Logic ---
    // In a real environment, you would use the PayPal Checkout SDK here:
    // 1. Initialize PayPal client with secrets from process.env (not frontend)
    // 2. Create an order request with total and cart items
    // 3. Obtain the order ID from PayPal

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const orderTotal = typeof total === "number" ? total : subtotal + tax;

    // Simulate secure order creation
    const order = createOrder({
      userId: "guest",
      email: shippingAddress.email || "guest@shopai.com",
      paymentMethod: "paypal",
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
        paypal_link: "https://www.paypal.com/checkoutnow?token=DEMO_TOKEN" 
      } 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
