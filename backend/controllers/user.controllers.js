import uploadOnCloudinary from "../config/cloudinary.js"
import moment from "moment";
import User from "../models/user.model.js";
import geminiResponse from "../Gemini.js";
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(400).json({ message: "user not found" })
    }
    return res.status(200).json(user)

  } catch (errr) {
    return res.status(400).json({ message: "get current user error" })
  }
}

export default getCurrentUser


export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    const user1 = await User.findById(req.userId);
    let assistantImage = user1.assistantImage; // keep old image by default

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    }
    else if (imageUrl) {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(req.userId, {
      assistantName,
      assistantImage
    }, { new: true }).select("-password");

    return res.status(200).json(user);

  } catch (error) {
    return res.status(400).json({ message: "update UpdateAssistant error" });
  }
};



export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // Get user from DB
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        response: "User not found."
      });
    }

    user.history.push(command);
    await user.save();

    const userName = user.name;
    const assistantName = user.assistantName;

    // Get Gemini response
    const result = await geminiResponse(command, assistantName, userName);

    if (!result) {
      return res.status(500).json({
        response: "Assistant service unavailable."
      });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({
        response: "Sorry, I couldn't understand."
      });
    }

    const gemResult = JSON.parse(jsonMatch[0]);

    // Make it safe against casing mistakes
    const type = gemResult.type;
    const userInput =
      gemResult.userInput ||
      gemResult.userinput ||
      command; // fallback to original command

    const response = gemResult.response || "Okay.";

    switch (type) {

      // ================= DATE =================
      case "get-date":
        return res.json({
          type,
          userInput: userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });

      // ================= TIME =================
      case "get-time":
        return res.json({
          type,
          userInput: userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });

      // ================= DAY =================
      case "get-day":
        return res.json({
          type,
          userInput: userInput,
          response: `Today is ${moment().format("dddd")}`
        });

      // ================= MONTH =================
      case "get-month":
        return res.json({
          type,
          userInput: userInput,
          response: `This month is ${moment().format("MMMM")}`
        });

      // ================= OTHER TYPES =================
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: response
        });

      // ================= DEFAULT =================
      default:
        return res.status(400).json({
          response: "I didn't understand that command."
        });
    }

  } catch (error) {
    console.error("AskToAssistant Error:", error);
    return res.status(500).json({
      response: "Something went wrong."
    });
  }
};