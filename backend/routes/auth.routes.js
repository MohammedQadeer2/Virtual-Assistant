import express from "express";
import {logIn, signUp, logOut } from "../controllers/auth.controllers.js"
  
const authRouter=express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", logIn)
authRouter.get("/signout", logOut)
export default authRouter