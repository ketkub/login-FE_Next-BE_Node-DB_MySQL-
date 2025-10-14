import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/db.config.js";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
    try{
        const { username, password, email } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hash, email });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }catch(error){
        res.status(400).json({ message: "Error registering user", error: error.message });
    }
};

export const login = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if(!user)
        {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword)
        {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user.id }, "your_jwt_secret", { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    }catch(error){
        res.status(500).json({ message: "Error logging in", error: error.message })};
};
