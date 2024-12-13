import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import crypto from 'crypto';

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

    const userId = session.user.id;
    const { 
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature 
    } = await req.json();

    if (!userId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the payment
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        { status: 404 }
      );
    }

    // Verify that the payment belongs to the authenticated user
    if (payment.from.toString() !== userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized payment verification" }),
        { status: 403 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400 }
      );
    }

    // Verify payment status with Razorpay
    const paymentVerification = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (paymentVerification.status !== 'captured') {
      payment.status = "failed";
      await payment.save();
      return new Response(
        JSON.stringify({ error: "Payment not captured" }),
        { status: 400 }
      );
    }

    // Update payment status
    payment.status = "completed";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    return new Response(
      JSON.stringify({ 
        success: true,
        payment: {
          id: payment._id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.createdAt
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to verify payment" }),
      { status: 500 }
    );
  }
}
