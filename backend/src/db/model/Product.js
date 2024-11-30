    import mongoose, { Schema } from "mongoose";

    // Schema for creating products
    const ProductSchema = new Schema({
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        brand: {
            type: String,
        },
        new_price: {
            type: Number,
            required: true
        },
        old_price:{
            type: Number,
            required: true
        },
        variants: {
            type: [
                {
                    variant_id: {
                        type: String,
                        required: true
                    },
                    details: {
                        type: String,
                        required: true
                    },
                    price: {
                        type: Number,
                        required: true
                    }
                }
            ]
        },
        colors: {
            type: [
                {
                    color: {
                        type: String,
                        required: true
                    },
                    image: {
                        type: String,
                        required: true
                    },
                    new_price: {
                        type: Number,
                        required: true
                    },
                    old_price: {
                        type: Number,
                        required: true
                    },
                    quantity: {
                        type: Number,
                        default: 0
                    },
                    sold: {
                        type: Number,
                        default: 0
                    },
                }
            ]
        },
        total_quantity: {
            type: Number,
            default: 0
        },
        total_sold: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            required: true
        },
        specifications: {
            type: Object
        },
        label: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    });

    const ProductModel = mongoose.model("Product", ProductSchema);

    export default ProductModel;