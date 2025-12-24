import { Request, Response } from "express";
import { Note } from "../models/note.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";

export const createNote = async (req: Request, res: Response) => {
  const { title, content, userId } = req.body;

  if (!title || typeof title !== "string") {
    const err = new Error("Title is required");
    (err as any).statusCode = 400;
    throw err;
  }
  if (!content || typeof content !== "string") {
    const err = new Error("Content is required");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error("Invalid user ID");
    (err as any).statusCode = 400;
    throw err;
  }

  const user = await User.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    (err as any).statusCode = 404;
    throw err;
  }

  const note = await Note.create({ title, content, userId });

  res.status(200).json(note);
};

export const getAllNotes = async (req: Request, res: Response) => {
  const notes = await Note.find().populate("userId", "name email"); // populate replaces the userId with the name and email of the user so its more clear to read
  res.status(200).json(notes);
};

export const getNotebyId = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid note ID");
    (err as any).statusCode = 400;
    throw err;
  }

  const note = await Note.findById(id).populate("userId", "name email");

  if (!note) {
    const err = new Error("Note not found");
    (err as any).statusCode = 404;
    throw err;
  }

  res.status(200).json(note);
};

export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid note ID");
    (err as any).statusCode = 400;
    throw err;
  }

  if (!title || !content) {
    const err = new Error("Title and content are required");
    (err as any).statusCode = 400;
    throw err;
  }
  const note = await Note.findByIdAndUpdate(
    id,
    { title, content },
    { new: true }
  );
   if (!note) {
    const err = new Error("Note not found");
    (err as any).statusCode = 404;
    throw err;
  }

  res.status(200).json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid note ID");
    (err as any).statusCode = 400;
    throw err;
  }

  const note = await Note.findByIdAndDelete(id);

  if (!note) {
    const err = new Error("Note not found");
    (err as any).statusCode = 404;
    throw err;
  }

  res.status(200).json({ message: "Note deleted successfully" });
};

