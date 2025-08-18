import express from "express";
import { subscribe, listSubscribers, deleteSubscriber, exportSubscribersCsv } from "../controllers/subscriberController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const Router = express.Router();

Router.post("/subscribe", subscribe);
Router.get("/", authenticate, authorize("admin"), listSubscribers);
Router.delete("/:id", authenticate, authorize("admin"), deleteSubscriber);
Router.get("/export/csv", authenticate, authorize("admin"), exportSubscribersCsv);

export default Router;


