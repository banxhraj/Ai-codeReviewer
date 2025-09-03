import generateContent from "../service/ai.service.js";
import chatModel from "../models/chatModel.js";

export const getReview = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    const review = await generateContent(code);

    await chatModel.create({
      userId: req.userId,
      code,
      review,
    });

    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestChats = async (req, res) => {
  try {
    const chats = await chatModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("code review createdAt");

    return res.json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


