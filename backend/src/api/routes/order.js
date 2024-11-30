import express from 'express'
import OrderModel from '../../db/model/Order.js'
import { fetchUser } from '../middleware/fetchUserFromToken.js';
import UserModel from '../../db/model/User.js';
import ProductModel from '../../db/model/Product.js';

const router = express.Router()

// API for Getting all orders for Admin
router.get('/all', fetchUser, async (req, res) => {
    const user = await UserModel.findById(req.user.id);

    if (user.role === "admin") {
        let orders = await OrderModel.find({});

        // Calculate total cost of each order
        orders = orders.map(order => {
            let total = 0;
            order.products.forEach(product => {
                total += product.new_price * product.quantity;
            })
            return {
                ...order.toObject(),
                total: total
            }
        })

        res.status(200).send(orders);
    } else {
        res.json({
            success: 0,
            message: "Token is invalid"
        })
    }
})

// API for Getting all orders of a User
router.post('/get', fetchUser, async (req, res) => {
    try {
        let orders;
        let status = req.body.status
        if (!status || status === "") {
            orders = await OrderModel.find({ user_id: req.user.id });
        } else {
            orders = await OrderModel.find({ user_id: req.user.id, status: status });
        }
    
        // If orders are not found, send a 404 response
        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: 0,
                message: 'No orders found.' 
            });
        }

        // Calculate total cost of each order
        orders = await Promise.all(orders.map(async (order) => {
            let total = 0;
            const orderProducts = await Promise.all(order.products.map(async (product) => {
                total += product.new_price * product.quantity;
                try {
                    const orderProduct = await ProductModel.findOne({ id: product.productId });
                    return {
                        ...product.toObject(),
                        name: orderProduct ? orderProduct.name : 'Unknown product'
                    };
                    } catch (productError) {
                    console.error('Error fetching product details:', productError);
                    return {
                        ...product.toObject(),
                        name: 'Error fetching product details'
                    };
                    }
            }))

            return {
                ...order.toObject(),
                products: orderProducts,
                total: total
            }
        }))
    
        // Send the orders with a 200 status code
        res.status(200).json({
            success: 1,
            orders: [...orders]
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
    
        // Send a 500 status code if there's a server error
        res.status(500).send({ error: 'Internal server error.' });
      }
})

// API for get an Order by ID
router.get('/get/:id', fetchUser, async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        // If orders are not found, send a 404 response
        if (!order) {
            return res.status(404).json({
                success: 0,
                message: 'Order does not exist'
            })
        }

        const user = await UserModel.findById(req.user.id);
        // If user is not an admin or userId is wrong, send a 404 response
        if (user.role !== "admin" && !user._id.equals(order.user_id)) {
            return res.status(404).json({
                success: 0,
                message: 'User not authorized or incorrect user ID'
            })
        } 

        // Get name of each product in order and total cost of order
        let oldTotal = 0;
        let total = 0;
        const orderProducts = await Promise.all(order.products.map(async (product) => {
            oldTotal += product.old_price * product.quantity;
            total += product.new_price * product.quantity;
            try {
                const orderProduct = await ProductModel.findOne({ id: product.productId });
                return {
                  ...product.toObject(),
                  name: orderProduct ? orderProduct.name : 'Unknown product'
                };
              } catch (productError) {
                console.error('Error fetching product details:', productError);
                return {
                  ...product.toObject(),
                  name: 'Error fetching product details'
                };
              }
        }))

        res.status(200).json({
            success: 1,
            order: {
                ...order.toObject(),
                products: orderProducts,
                old_total: oldTotal,
                total: total
            }
        })
    } catch (error) {
        console.error('Error fetching orders:', error);
    
        // Send a 500 status code if there's a server error
        res.status(500).send({ error: 'Internal server error.' });
    }
})

router.post('/add', fetchUser, async (req, res) => {
    try {
        let newOrder = new OrderModel({
            user_id: req.user.id,
            ...req.body
        });

        newOrder.products = await Promise.all(newOrder.products.map(async (product) => {
            try {
                const orderProduct = await ProductModel.findOne({id: product.productId});
                const color = orderProduct.colors.find(item => item.color === product.color)
                return {
                    ...product.toObject(),
                    new_price: orderProduct && color ? color.new_price : 0,
                    old_price: orderProduct && color ? color.old_price : 0
                }
            } catch (productError) {
                console.error('Error fetching product details:', productError);
                return {
                  ...product.toObject(),
                  new_price: 0,
                  old_price: 0
                };
            }
        }))

        await newOrder.save();

        res.status(201).json({
            success: 1,
            message: 'Order created successfully',
            data: {
                orderId: newOrder.id
            }
        })
    } catch (error) {
        console.error('Error creating orders:', error);
    
        // Send a 500 status code if there's a server error
        res.status(500).send({ error: 'Internal server error.' });
    }
})

export { router };