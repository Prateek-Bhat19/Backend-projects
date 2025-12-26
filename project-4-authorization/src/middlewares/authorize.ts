import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/role';
import { AppError } from '../utils/appError';

export const authorize = (allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) {
        throw new AppError('Unauthorized', 401);
    }

    if(!allowedRoles.includes(req.user.role)) {
        throw new AppError('Forbidden', 403);
    }

    next();
}