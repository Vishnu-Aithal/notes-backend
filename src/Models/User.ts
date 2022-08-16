import { Schema, model } from "mongoose";
import { NoteSchema } from "./Note";
import { TodoSchema } from "./Todo";

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt: String,
    updatedAt: String,
    notes: [NoteSchema],
    archives: [NoteSchema],
    trash: [NoteSchema],
    todos: [TodoSchema],
});

export const User = model("User", UserSchema);
export type UserModelType = InstanceType<typeof User>;
