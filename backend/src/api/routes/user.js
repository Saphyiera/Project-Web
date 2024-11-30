import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../../db/model/User.js'
import CartModel from '../../db/model/Cart.js';

const router = express.Router();

dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

// API for registering user account
router.post('/signup', async (req, res) => {
    let check = await UserModel.findOne({email: req.body.email});
    if (check) {
        return res.json({
            success: false,
            errors: "Existing user found with the same email address"
        });
    }
    
    let cart = [];
    
    const user = new UserModel({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    })
    await user.save();
    
    if (user.role === "user") {
        const userCart = new CartModel({
            user_id: user.id,
            cart_data: cart
        })
        await userCart.save();
    }
    
    const data = {
        user: {
            id: user.id
        }
    };
    const token = jwt.sign(data, jwt_secret);

    res.json({
        success: true,
        token,
        userInfo : {
            username: user.name,
            email: user.email
        },
        role: user.role
    });
});

// Creating endpoint for user login
router.post('/login', async (req, res) => {
    let user =  await UserModel.findOne({email: req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(data, jwt_secret);
            res.json({
                success: true,
                token,
                userInfo : {
                    username: user.name,
                    email: user.email
                },
                role: user.role
            })
        } else {
            res.json({
                success: false,
                errors: "Wrong Password"
            });
        }
    } else {
        res.json({
            success: false,
            errors: "Wrong Email Address"
        });
    }
});

export { router };