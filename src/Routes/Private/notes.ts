import { Handler, response, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { Note } from "../../Models/Note";
import { UserModelType } from "../../Models/User";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";

export const notesRouter = Router();

const getAllNotes: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ notes: user.notes });
    } catch (error) {
        next(error);
    }
};

const addNoteToNotes: Handler = async (req, res, next) => {
    try {
        const { note } = req.body;
        const user: UserModelType = req.user;
        user.notes.push(new Note(note));
        await user.save();
        res.status(201).json({ notes: user.notes });
    } catch (error) {
        next(error);
    }
};

const editNoteFromNotes: Handler = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const { note } = req.body;
        const user: UserModelType = req.user;
        const noteIndex = user.notes.findIndex(
            (note) => note._id?.toString() === noteId
        );
        if (noteIndex === -1) {
            throw errorMessageWithCode("Note not found", 404);
        }

        try {
            user.notes[noteIndex].heading = note.heading;
            user.notes[noteIndex].body = note.body;
            user.notes[noteIndex].tags = note.tags;
            user.notes[noteIndex].priority = note.priority;
            user.notes[noteIndex].color = note.color;
            user.notes[noteIndex].pinned =
                note.pinned ?? user.notes[noteIndex].pinned;
        } catch (error) {
            throw errorMessageWithCode("bad request body", 400);
        }

        await user?.save();
        res.json({ notes: user.notes });
    } catch (error) {
        next(error);
    }
};

notesRouter
    .route("/notes/api/notes")
    .get(verifyAuth, getAllNotes)
    .post(verifyAuth, addNoteToNotes);

notesRouter
    .route("/notes/api/notes/:noteId")
    .post(verifyAuth, editNoteFromNotes);
