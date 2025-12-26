import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AppError } from "../utils/appError";

export const getAllUsers = async(req: Request, res: Response) => {
    const users = await User.find().select('-password');
    res.json(users);
}

export const updateUserRole = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const { role } = req.body;

    if(!['user', 'admin'].includes(role)) {
        throw new AppError('Invalid role', 400);
    }

    const user = await User.findById(userId);
    if(!user) {
        throw new AppError('User not found', 404);
    }
    //preventing admin from demoting themselves
    if(req.user!.id === user._id.toString()) {
        throw new AppError('Cannot change your own role', 403);
    }

    user.role = role;
    await user.save();

     res.json({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });
}