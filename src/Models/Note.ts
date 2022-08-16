import { model, Schema } from "mongoose";

export const NoteSchema = new Schema({
    heading: String,
    body: String,
    tags: [String],
    priority: String,
    color: String,
    pinned: Boolean,
    created: String,
});

export const Note = model("Note", NoteSchema);
