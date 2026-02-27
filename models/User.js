const mongoose = require("mongoose");
const { getCoinPrice } = require("../config/coinConfig");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    uniqueId: { type: String, unique: true, sparse: true },

    referralCode: { type: String, unique: true },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActivated: { type: Boolean, default: false },

    position: {
      type: Number,
      default: null,
      index: true,
    },

    walletBalance: { type: Number, default: 0 },
    bonusWallet: { type: Number, default: 0 },
    activationAmountRemaining: { type: Number, default: 0 },
    activationCoinsRemaining: { type: Number, default: 0 },
    // coins field removed - now calculated dynamically

    bankDetails: {
      accountHolderName: { type: String, default: "" },
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      branch: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      upiId: { type: String, default: "" },
      qrImage: { type: String, default: "" },
    },

    milestones: {
      m50: { type: Boolean, default: false },
      m100: { type: Boolean, default: false },
      m250: { type: Boolean, default: false },
      m500: { type: Boolean, default: false },
      m1000: { type: Boolean, default: false },
      m2500: { type: Boolean, default: false },
    },

    withdrawalData: {
      lastWithdrawalDate: { type: String, default: null },
      withdrawnTodayCoins: { type: Number, default: 0 },
      startOfDayCoins: { type: Number, default: 0 },
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field: Calculate coins from wallet balance
userSchema.virtual("coins").get(function () {
  const coinPrice = getCoinPrice();
  if (!Number.isFinite(coinPrice) || coinPrice <= 0) return 0;

  const amount = Number.isFinite(this.activationAmountRemaining) && this.activationAmountRemaining > 0
    ? this.activationAmountRemaining
    : Number.isFinite(this.activationCoinsRemaining)
      ? this.activationCoinsRemaining * coinPrice
      : 0;

  return amount / coinPrice;
});

module.exports = mongoose.model("User", userSchema);
