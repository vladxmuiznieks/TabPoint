import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const loginController = async (req, res) => {
    try {
        let { pin } = req.body; 

        pin = String(pin).trim(); // cast to string and trim
        console.log("Type of received PIN:", typeof pin);

    

        console.log("PIN before query: ", pin, typeof pin);
        console.log("Executing query: userModel.findOne({ pin: \"" + pin + "\" })");
        const user = await userModel.findOne({ pin: pin });
        console.log("Database Query Result:", user);
        console.log("Found user:", user);
        console.log(req.body);
        console.log(String(pin).trim());
        

        if (user) {
            console.log("User Verified Status:", user.verified);
            if(user.verified) {
                console.log("Login successful for user:", user.name);
                // Create JWT token 
                const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, 'testing123123', { expiresIn: '8h' });
                res.status(200).json({ message: 'Login successful', user, token });
            } else {
                console.log("User found but not verified"); 
                res.status(401).json({ message: "User found but not verified", user: null });
            }
        } else {
            console.log("No user found with the given PIN"); 
            res.status(401).json({ message: "Login unsuccessful!", user: null });
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", user: null });
    }
};


export const registerController = async (req, res) => {
    console.log("Received request in registerController with body:", req.body);
    try {
        const newUser = new userModel({...req.body, verified: true}); 
        await newUser.save();
        res.status(201).json({ message: "User added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

