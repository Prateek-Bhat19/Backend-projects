import { Schema, model} from "mongoose";

const userSchema = new Schema( {
    provider: {type: String, required: true},
    providerId: {type: String, required: true},
    name: String,
    email: String,
    role: {
        type: String,
        enum: ["owner", "viewer"],
        default: "owner"
    }

}, {timestamps: true});

export const User = model("User", userSchema);
