import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpass = encodeURIComponent(process.env.DBPASS);

mongoose.connect("mongodb://localhost:27017/mern-cafe").then(() => {
  app.listen(8080, () => {
    console.log("Server started");
  });
});



  // mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.rcpg0eg.mongodb.net/mern-cafe?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
  //   app.listen(8080, () => {
  //     console.log("Server started");
  //   });
  // });

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter)
app.use("/api/payments", paymentRouter)