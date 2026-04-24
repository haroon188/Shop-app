/**
 * PayPal Server-Side Integration (v2 API)
 * This library handles OAuth, Create Order, and Capture Order logic securely on the server.
 */

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_BASE_URL } = process.env;

export interface PaypalCartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Generates an OAuth 2.0 Access Token from PayPal
 */
export async function generateAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error("Missing PayPal credentials in environment variables.");
  }

  if (PAYPAL_CLIENT_ID === "test" || PAYPAL_SECRET === "test") {
    return "MOCK_ACCESS_TOKEN";
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = (await response.json()) as { error_description?: string; access_token: string };
  if (!response.ok) {
    throw new Error(`Failed to generate Access Token: ${data.error_description || response.statusText}`);
  }

  return data.access_token;
}

/**
 * Creates a real PayPal Order
 * @param cartItems - Array of products from the cart
 * @param total - Total amount in USD
 */
export async function createPaypalOrder(cartItems: PaypalCartItem[], total: number) {
  if (PAYPAL_CLIENT_ID === "test" || PAYPAL_SECRET === "test") {
    console.log("🛠️ Using PayPal Mock Mode for Create Order");
    return {
      id: `MOCK_ORDER_${Math.floor(Math.random() * 1000000)}`,
      status: "CREATED",
    };
  }

  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders`;

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total.toFixed(2), // PayPal requires strings with 2 decimal places
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2),
            },
            // Tax and shipping can be added here for a more detailed breakdown
          },
        },
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: "USD",
            value: item.price.toFixed(2),
          },
        })),
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

/**
 * Captures an approved PayPal Order to finalize the payment
 * @param orderID - The order ID from createOrder
 */
export async function capturePaypalOrder(orderID: string) {
  if (PAYPAL_CLIENT_ID === "test" || PAYPAL_SECRET === "test") {
    console.log("🛠️ Using PayPal Mock Mode for Capture Order");
    return {
      status: "COMPLETED",
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: `MOCK_CAPTURE_${Math.floor(Math.random() * 1000000)}`,
                amount: {
                  value: "100.00" // Mock value
                }
              }
            ]
          }
        }
      ]
    };
  }

  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

async function handleResponse(response: Response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(`PayPal API Error: ${errorMessage}`);
}
