import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { generateJWT } from "../utils/generateJWT.js";

export const signup = async (req, res, next) => {
  const { email, password } = req?.body;

  if (!email || !password)
    return apiError(res, "Email and Password are required", false, 400);

  if (!/\S+@\S+\.\S+/.test(email)) {
    return apiError(res, "Please provide a valid email address", false, 400);
  }

  if (password.length < 6) {
    return apiError(res, "Password must be at least 6 characters long", false, 400);
  }

  try {
    const existingUser = await User.findOne({email});

    if(existingUser){
      return apiError(res, "Email is already registered", false, 400);
    }

    const user = await User.create({ email, password });

    const token = generateJWT(user);

    if(!token) return apiError(res, "Token generation failed", false, 500);

    res.status(201).json({
      data: {
        success: true,
        message: "User create successfully",
         user: {
            id: user._id,
            email: user.email,
          },
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
    const { email, password } = req?.body;

    if (!email || !password)
      return apiError(res, "Email and Password are required", false, 400);
  
    try {
      const user = await User.findOne({ email });

      if (!user) return apiError(res, "Invalid email or password", false, 401);
  
      const isMatch = await user.comparePassword(password);

      if (!isMatch)
        return apiError(res, "Invalid email or password", false, 401);
  
      const token = generateJWT(user);
      if(!token) return apiError(res, "Token generation failed", false, 500);
  
      res.status(200).json({
        data: {
          success: true,
          message: "User signed in successfully",
          user: {
            id: user._id,
            email: user.email,
          },
        },
        token,
      });
    } catch (error) {
      next(error);
    }
};
