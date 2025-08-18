import Subscriber from "../models/subscriberModel.js";

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(200).json({ message: "You're already subscribed" });
    }

    await Subscriber.create({ email: normalizedEmail });
    return res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const listSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = search
      ? { email: { $regex: String(search), $options: "i" } }
      : {};
    const count = await Subscriber.countDocuments(filter);
    const total = Math.ceil(count / Number(limit));
    const subscribers = await Subscriber.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    return res.status(200).json({ subscribers, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await Subscriber.findByIdAndDelete(id);
    return res.status(200).json({ message: "Subscriber deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const exportSubscribersCsv = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({}, { email: 1, createdAt: 1, _id: 0 }).sort({ createdAt: -1 });
    const header = "email,createdAt\n";
    const rows = subscribers
      .map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)
      .join("\n");
    const csv = header + rows + (rows ? "\n" : "");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename= subscribers.csv");
    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { subscribe, listSubscribers, deleteSubscriber, exportSubscribersCsv };


