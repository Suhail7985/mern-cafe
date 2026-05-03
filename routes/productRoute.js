import express from "express";
import { addProduct,showProducts,deleteProduct,updateProduct,getProduct,displayProducts } from "../controllers/productController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const Router = express.Router();

//user 
Router.get("/all", displayProducts);

//admin
Router.get("/", authenticate, authorize("admin"), showProducts);
Router.post("/", authenticate, authorize("admin"), addProduct);
Router.get("/:id", authenticate, authorize("admin"), getProduct);
Router.patch("/:id", authenticate, authorize("admin"), updateProduct);
Router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default Router;