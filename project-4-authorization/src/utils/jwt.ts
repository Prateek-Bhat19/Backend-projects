import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from './appError';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!jwtSecret) {
    throw new AppError('Access token secret not defined', 500);
}

export const signToken = (
    payload: { id: string; role: 'user' | 'admin' }
) => {
    const options: SignOptions = {};

    if (jwtExpiresIn) {
        options.expiresIn = jwtExpiresIn as SignOptions['expiresIn'];
    }
    
    return jwt.sign(payload, jwtSecret as string, options);
}