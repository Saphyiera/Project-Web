import mongoose, { Schema } from "mongoose";

//Schema for creating brands
const BrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    }
});

const BrandModel = mongoose.model("Brand", BrandSchema);

export default BrandModel;