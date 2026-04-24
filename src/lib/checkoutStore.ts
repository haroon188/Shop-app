import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export interface CheckoutCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface CheckoutOrder {
  id: string;
  userId: string;
  email: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  cartItems: CheckoutCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "cancelled";
  paypalOrderId?: string;
  paypalCaptureId?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "checkout-orders.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readOrdersFromDisk(): CheckoutOrder[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const raw = fs.readFileSync(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as CheckoutOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrdersToDisk(orders: Map<string, CheckoutOrder>) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(Array.from(orders.values()), null, 2));
}

const orders = new Map<string, CheckoutOrder>(readOrdersFromDisk().map((order) => [order.id, order]));

export function getOrdersForUser(userId: string): CheckoutOrder[] {
  return Array.from(orders.values())
    .filter((order) => order.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getOrderById(orderId: string): CheckoutOrder | null {
  return orders.get(orderId) || null;
}

export function createOrder(
  payload: Omit<CheckoutOrder, "id" | "status" | "createdAt" | "updatedAt">
): CheckoutOrder {
  const now = new Date().toISOString();
  const order: CheckoutOrder = {
    ...payload,
    id: `ord_${randomUUID()}`,
    status: "paid",
    createdAt: now,
    updatedAt: now,
  };

  orders.set(order.id, order);
  saveOrdersToDisk(orders);
  return order;
}

export function updateOrderStatus(
  orderId: string,
  userId: string,
  status: CheckoutOrder["status"]
): CheckoutOrder | null {
  const order = orders.get(orderId);
  if (!order || order.userId !== userId) return null;

  const updated: CheckoutOrder = {
    ...order,
    status,
    updatedAt: new Date().toISOString(),
  };

  orders.set(orderId, updated);
  saveOrdersToDisk(orders);
  return updated;
}

export function updateOrderAddress(
  orderId: string,
  userId: string,
  shippingAddress: Partial<ShippingAddress>
): CheckoutOrder | null {
  const order = orders.get(orderId);
  if (!order || order.userId !== userId) return null;

  const updated: CheckoutOrder = {
    ...order,
    shippingAddress: {
      ...order.shippingAddress,
      ...shippingAddress,
    },
    updatedAt: new Date().toISOString(),
  };

  orders.set(orderId, updated);
  saveOrdersToDisk(orders);
  return updated;
}

export function cancelOrder(orderId: string, userId: string): boolean {
  const order = orders.get(orderId);
  if (!order || order.userId !== userId) return false;
  orders.delete(orderId);
  saveOrdersToDisk(orders);
  return true;
}
