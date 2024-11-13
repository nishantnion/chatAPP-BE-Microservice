// userModal.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
  },

  name : {
    type : String,
    default: "User"
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email address",
    },
  },

  password: {
    type: String,
    required: true,
  },
  bio: {
     type: String,
     default: "" 
    },

  profilePicture: {
     type: String, 
     default: "" 
    },

  isBlocked: {
    type: Boolean,
    default: false,
  },
  
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { id: this._id, username: this.username, email: this.email },
      process.env.JWT_SECRET
    );
   
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.log("generate auth token error===>", error);
  }
};

module.exports = mongoose.model("User", userSchema);
