import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  downloads: {
    type: Number,
    default: 0
  },
  lastDownloadDate: String,
  isPremium: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("User", userSchema);