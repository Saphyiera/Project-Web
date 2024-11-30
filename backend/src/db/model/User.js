import mongoose, { Schema } from "mongoose";

// Create schema for user model
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;