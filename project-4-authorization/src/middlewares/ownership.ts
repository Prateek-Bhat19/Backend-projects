import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { Note } from '../models/note.model';

export const noteOwnership = async (
    req: Request,
  res: Response,
  next: NextFunction
) => {
    const note = await Note.findById(req.params.id);

    if(!note) {
        throw new AppError('Note not found', 404);
    }

    //admin override
    if(req.user!.role === 'admin') {
        req.note = note;
        return next();
    }

    //ownership check
    if(note.user.toString() !== req.user!.id) {
        throw new AppError('Forbidden', 403);
    }

    req.note = note;
    next();
}