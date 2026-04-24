import { NextRequest, NextResponse } from "next/server";
import { capturePaypalOrder } from "../../../../lib/paypal";
import { createOrder, type CheckoutCartItem, type ShippingAddress } from "../../../../lib/checkoutStore";

/**
 * Endpoint to securely capture an approved PayPal Order.
 * On success, we persist the order to the database.
 */
export async function POST(req: NextRequest) {
  try {
    const { orderID, shippingAddress, cartItems } = (await req.json()) as {
      orderID?: string;
      shippingAddress?: ShippingAddress & { email?: string };
      cartItems?: CheckoutCartItem[];
    };

    if (!orderID || !shippingAddress || !cartItems) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Capture the payment using the real PayPal Order ID
    const capture = await capturePaypalOrder(orderID);

    if (capture.status !== "COMPLETED") {
      return NextResponse.json({ error: `Capture failed: ${capture.status}` }, { status: 400 });
    }

    // --- Database Persistence (MOCK) ---
    // At this point, the payment is real. We save to the local store.
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.08;
    const total = parseFloat(capture.purchase_units[0].payments.captures[0].amount.value);

    const order = createOrder({
      userId: "guest",
      email: shippingAddress.email || "guest@shopai.com",
      paymentMethod: "paypal",
      shippingAddress,
      cartItems,
      subtotal,
      tax,
      total,
      // PayPal data
      paypalOrderId: orderID,
      paypalCaptureId: capture.purchase_units[0].payments.captures[0].id,
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      captureStatus: capture.status 
    }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to capture PayPal order:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
