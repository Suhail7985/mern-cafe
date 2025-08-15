import express from "express";
import { createOrder, verifyPayment, getPaymentStatus } from "../controllers/paymentController.js";

const Router = express.Router();

Router.post("/razorpay/order", createOrder);
Router.post("/razorpay/verify", verifyPayment);
Router.get("/razorpay/status/:orderId", getPaymentStatus);

export default Router;


