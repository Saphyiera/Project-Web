import express from 'express'

// Import model for product
import ProductModel from '../../db/model/Product.js'

// Import model for cart
import CartModel from '../../db/model/Cart.js'

// Import middlewares
import { fetchUser } from '../middleware/fetchUserFromToken.js';

const router = express.Router();

// API for getting cart data 
router.get('/get', fetchUser, async (req, res) => {
    let userCart = await CartModel.findOne({user_id: req.user.id});
    
    // Use Promise.all to handle asynchronous operations in map
    let cart = await Promise.all(userCart.cart_data.map(async (item) => {
        let product = await ProductModel.findOne({id: item.productId});
        let cartItem;
        product.colors.forEach((colorItem) => {
            if (colorItem.color === item.color) {
                cartItem = colorItem;
            }
        })
        return {
            productId: item.productId,
            name: product?.name,
            color: item.color,
            image: cartItem.image,
            new_price: cartItem.new_price,
            old_price: cartItem.old_price,
            quantity: item.quantity
        }; 
    }));
    res.json(cart);
});

// API for adding cart data to cart
router.post('/addToCart', fetchUser, async (req, res) => {
    let userCart = await CartModel.findOne({user_id: req.user.id});
    
    // Check req.body.color if it was in the cart before
    let found = false;
    let index = 0;
    userCart.cart_data.forEach((product, i) => {
        if (product && product.productId === req.body.productId && product.color === req.body.color) {
            found = true;
            index = i;
        }
    })
    if (found) {
        userCart.cart_data[index].quantity += 1;
    }
    else {
        userCart.cart_data = [
            ...userCart.cart_data,
            {
                productId: req.body.productId,
                color: req.body.color,
                quantity: 1
            }
        ]
    }

    await CartModel.findOneAndUpdate({user_id: req.user.id}, {cart_data: userCart.cart_data});
    res.json("Added");
});

// API for removing product from cart
router.post('/removeFromCart', fetchUser, async (req, res) => {
    let userCart = await CartModel.findOne({user_id: req.user.id});
    
    // Check req.body.color if it was in the cart before
    let found = false;
    let index = 0;
    userCart.cart_data.forEach((product, i) => {
        if (product && product.productId === req.body.productId && product.color === req.body.color) {
            found = true;
            index = i;
        }
    })
    if (found) {
        if (userCart.cart_data[index].quantity > 0) {
            userCart.cart_data[index].quantity -= 1;
        }
        if (userCart.cart_data[index].quantity === 0) {
            userCart.cart_data.splice(index, 1);
        }
    }

    await CartModel.findOneAndUpdate({user_id: req.user.id}, {cart_data: userCart.cart_data});
    res.json("Removed");
});

router.delete('/deleteFromCart', fetchUser, async (req, res) => {
    let userCart = await CartModel.findOne({user_id: req.user.id});
    
    // Check req.body.color if it was in the cart before
    let found = false;
    let index = 0;
    userCart.cart_data.forEach((product, i) => {
        if (product && product.productId === req.body.productId && product.color === req.body.color) {
            found = true;
            index = i;
        }
    })

    if (found) {
        userCart.cart_data.splice(index, 1);
    }

    await CartModel.findOneAndUpdate({user_id: req.user.id}, {cart_data: userCart.cart_data});
    res.json("Deleted");
})

export { router };