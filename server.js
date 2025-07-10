import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())

const dbuser = encodeURIComponent(process.env.DBUSER)
const dbpass = encodeURIComponent(process.env.DBPASS)

// mongoose.connect("mongodb://localhost:27017/mern-cafe").then(() => {
//   app.listen(8080, () => {
//     console.log("Server started");
//   });
// });



mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.rcpg0eg.mongodb.net/mern-cafe?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
  app.listen(8080, () => {
    console.log("Server started");
  });
});

app.use("/api/users", userRouter);