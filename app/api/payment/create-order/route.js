import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Payment from "@/models/Payment";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { amount, creatorId, message } = await req.json();
    const userId = session.user.id;

    if (!userId || !creatorId || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Verify creator exists
    const creator = await User.findById(creatorId);
    if (!creator) {
      return new Response(
        JSON.stringify({ error: "Creator not found" }),
        { status: 404 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: userId,
        creatorId: creatorId,
        message: message || ""
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = new Payment({
      amount,
      from: userId,
      to: creatorId,
      message: message || "",
      razorpayOrderId: order.id,
      razorpayPaymentId: "", // Will be updated after payment
      status: "pending",
    });

    await payment.save();

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create payment" }),
      { status: 500 }
    );
  }
}
