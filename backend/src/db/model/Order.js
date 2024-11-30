import mongoose, { Schema } from "mongoose";

// Schema for creating orders
const OrderSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                productId: {
                    type: Number
                },
                color: {
                    type: String
                },
                image: {
                    type: String
                },
                new_price: {
                    type: Number
                },
                old_price: {
                    type: Number
                },
                quantity: {
                    type: Number
                }
            }
        ],
        required: true
    },
    note: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment_modal: {
        type: String,
        required: true
    },
    payment_status: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        default: "Chờ xác nhận"
    }
});

const OrderModel = mongoose.model('Order', OrderSchema);

export default OrderModel;