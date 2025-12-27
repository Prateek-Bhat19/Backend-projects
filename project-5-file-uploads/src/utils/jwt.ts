import jwt from "jsonwebtoken";

export const signToken = (payload: {
    id: string;
    role: 'user' | 'admin';
}) => {
    return jwt.sign(
        payload, 
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "1d"}
    );
};