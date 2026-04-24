import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/checkoutStore";
import { getUserFromRequest } from "@/lib/auth";

/**
 * Securely fetch details for a single order.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  const user = getUserFromRequest(req);
  
  const order = getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Security check: Only the owner or a guest session can see the order
  if (order.userId !== "guest" && order.userId !== user?.id) {
    return NextResponse.json({ error: "Unauthorized access to order." }, { status: 403 });
  }

  return NextResponse.json({ order });
}
