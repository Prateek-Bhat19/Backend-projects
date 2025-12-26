import { Role } from "./role";
import {INote} from "../models/note.model"
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: Role;
            };
            note? : INote;
        }
    }
}

export {};