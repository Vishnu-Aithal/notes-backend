import { model, Schema } from "mongoose";

export const TodoSchema = new Schema({
    name: String,
    status: String,
});

export const Todo = model("Todo", TodoSchema);
