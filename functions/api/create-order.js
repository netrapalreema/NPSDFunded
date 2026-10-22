export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const amount = Number(body.amount);

    // केवल तय Challenge Plans स्वीकार करें
    const allowedAmounts = [499900, 999900, 1499900, 2499900];

    if (!allowedAmounts.includes(amount)) {
      return Response.json({ error: "Invalid plan amount" }, { status: 400 });
    }

    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      return Response.json({ error: "Payment configuration missing" }, { status: 500 });
    }

    const credentials = btoa(
      ${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}
    );

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: Basic ${credentials},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: npsd_${Date.now()}
      })
    });

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json({ error: "Unable to create order" }, { status: 500 });
  }
}
