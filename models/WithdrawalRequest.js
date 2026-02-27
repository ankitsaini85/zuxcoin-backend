const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: Number,        // ₹ amount
    coinAmount: Number,    // coin amount
    taxRate: { type: Number, default: 0.05 },
    taxAmount: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["coin", "bonus"],
      default: "coin",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalRequest", withdrawalSchema);
