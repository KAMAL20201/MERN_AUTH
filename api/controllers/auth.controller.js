import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const randomString = crypto.randomBytes(128).toString("hex");
  const emailVerified = false;
  console.log(randomString);
  const userEmail = await User.findOne({ email });
  const userName = await User.findOne({ username });
  if (userEmail) {
    return next(
      errorHandler(409, "User already exists", "EMAIL_ALREADY_EXISTS")
    );
  }
  if (userName) {
    return next(
      errorHandler(409, "User already exists", "USERNAME_ALREADY_EXISTS")
    );
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    uniqueString: randomString,
    emailVerified,
  });

  try {
    await newUser.save();
    sendMail(email, randomString);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Invalid Credentials"));
    }

    const token = jwt.sign(
      {
        id: validUser?._id,
      },
      process.env.JWT_SECRET
    );

    const expiryDate = new Date(Date.now() + 3600000);
    res.status(200).json({ validUser, token });
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET);

      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000);

      res.status(200).json({ ...rest, token });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser?._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);

      res.status(200).json({ ...rest, token });
    }
  } catch (err) {
    next(err);
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json({ success: true });
};
