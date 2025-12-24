import { Request, Response } from "express";
import { User } from "../types/user";
import { users } from "../data/users";

export const createUser = (req: Request, res: Response) => {
  const { name, email, age } = req.body;

  if (!name || typeof name !== "string") {
    const err = new Error("Name is required and must be a string");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!email || typeof email != "string" || !email.includes("@")) {
    const err = new Error("Valid email is required");
    (err as any).statusCode = 400;
    throw err;
  }

  if (age === undefined || typeof age !== "number" || age < 0 || age > 100) {
    const err = new Error("Age must be a positive number");
    (err as any).statusCode = 400;
    throw err;
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    age,
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

export const getUserbyId = (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(users);

  const user = users.find((u) => u.id === id);

  if (!user) {
    const err = new Error("User not found");
    (err as any).statusCode = 400;
    throw err;
  }

  res.status(200).json(user);
};

export const getAllUsers = (req: Request, res: Response) => {
    res.status(200).json(users);
}
export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    const err = new Error("User not found");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!name || typeof name !== "string") {
    const err = new Error("Name is required and must be a string");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    const err = new Error("Valid email is required");
    (err as any).statusCode = 400;
    throw err;
  }

  if (age === undefined || typeof age !== "number" || age <= 0) {
    const err = new Error("Age must be a positive number");
    (err as any).statusCode = 400;
    throw err;
  }

  users[userIndex] = {
    id,
    name,
    email,
    age,
  };

  res.status(200).json(users[userIndex]);
};

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    const err = new Error("User not found");
    (err as any).statusCode = 400;
    throw err;
  }

  users.splice(userIndex, 1);

  res.status(200).json({ message: "user deleted successfully " });
};
