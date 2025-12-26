import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface INote extends Document {
  title: string;
  content?: string;
  user: Types.ObjectId;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Note = model<INote>("Note", noteSchema);
