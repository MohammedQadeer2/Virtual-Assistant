import genToken from "../config/token.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters!"
            });
        }

        const userPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            password: userPassword,
            email
        });

        const token = await genToken(newUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false,
        });

        return res.status(201).json(newUser);

    } catch (err) {
        return res.status(500).json({
            message: `Sign up error ${err.message}`
        });
    }
};


export const logIn = async(req, res)=> {
    try {
        const { password, email} = req.body;
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "User not exists!!"})
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "password is incorrect!!"})
        }

        const token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge: 7*24*60*60*1000,
            sameSite:"strict",
            secure:false,
        })

        return res.status(201).json(user)
    } catch (err) {
        return res.status(500).json({message:`login up error ${err}`})
    }
}

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    return res.status(400).json({ message: "Logout failed" });
  }
};