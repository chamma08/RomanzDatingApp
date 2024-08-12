const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  age: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  step1: {
    type: Boolean,
    default: false,
  },
  step2: {
    type: Boolean,
    default: false,
  },
  subscription: {
    type: String,
    enum: ["free", "plus", "premium"],
  },
  profilePicture: {
    type: String,
   /*  default: "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" */
},
isAdmin: {
    type: Boolean,
    default: false
},
hobby: {
  type: String,
},
  verificationToken: String,
  crushes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  recievedLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  profileImages: [
    {
      type: String,
       default: "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="
    },
  ],
  description: {
    type: String,
  },
  turnOns: [
    {
      type: String, //Array of string for turn ons
    },
  ],
  lookingFor: [
    {
      type: String, // Array of strings for what they are looking for
    },
  ],
}, { timestamps: true });


const User = mongoose.model("User",userSchema);

module.exports = User