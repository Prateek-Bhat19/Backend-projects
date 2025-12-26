import { Request, Response } from 'express';
import { Note } from '../models/note.model';
import { AppError } from '../utils/appError';

export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const note = await Note.create({
    title,
    content,
    user: req.user!.id,
  });

  res.status(201).json(note);
};

export const getMyNotes = async (req: Request, res: Response) => {
  const notes = await Note.find({ user: req.user!.id });
  res.json(notes);
};

export const deleteNote = async (req: Request, res: Response) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw new AppError('Note not found', 404);
  }

  await note.deleteOne();
  res.status(204).send();
};
