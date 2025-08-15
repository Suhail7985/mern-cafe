import Razorpay from "razorpay";
import crypto from "crypto";

const createRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt = "rcpt_1", notes = {} } = req.body || {};
    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ message: "Amount is required (in INR)." });
    }

    const instance = createRazorpayInstance();
    const order = await instance.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt,
      notes,
    });

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create Razorpay order." });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid verification payload." });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ message: "Server misconfigured. Missing Razorpay secret." });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Verification failed." });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: "Order ID is required." 
      });
    }

    const instance = createRazorpayInstance();
    const order = await instance.orders.fetch(orderId);

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        receipt: order.receipt,
        created_at: order.created_at
      }
    });
  } catch (err) {
    console.error("Error fetching payment status:", err);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch payment status.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export { createOrder, verifyPayment, getPaymentStatus };


