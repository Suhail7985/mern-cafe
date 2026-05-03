import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    orderValue: { type: Number },
    status: { type: String, default: "Pending" },
    email: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{ type: Object }],
    deliveryAddress: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: "India" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);