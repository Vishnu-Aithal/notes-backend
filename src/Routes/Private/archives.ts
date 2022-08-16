import { Handler, response, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { Note } from "../../Models/Note";
import { UserModelType } from "../../Models/User";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";

export const archivesRouter = Router();

const getAllArchives: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ archives: user.archives });
    } catch (error) {
        next(error);
    }
};

const addNoteToArchives: Handler = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const user: UserModelType = req.user;
        const noteIndex = user.notes.findIndex(
            (note) => note._id?.toString() === noteId
        );
        const [note] = user.notes.splice(noteIndex, 1);
        user.archives.push(note);
        await user.save();
        res.status(201).json({ notes: user.notes, archives: user.archives });
    } catch (error) {
        next(error);
    }
};

const restoreNoteFromArchives: Handler = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const user: UserModelType = req.user;
        const noteIndex = user.archives.findIndex(
            (note) => note._id?.toString() === noteId
        );
        const [note] = user.archives.splice(noteIndex, 1);
        user.notes.push(note);
        await user.save();
        res.status(201).json({ notes: user.notes, archives: user.archives });
    } catch (error) {
        next(error);
    }
};

const deleteNoteFromArchives: Handler = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const user: UserModelType = req.user;
        const noteIndex = user.archives.findIndex(
            (note) => note._id?.toString() === noteId
        );
        user.archives.splice(noteIndex, 1);
        await user.save();
    } catch (error) {
        next(error);
    }
};

archivesRouter.route("/notes/api/archives").get(verifyAuth, getAllArchives);

archivesRouter
    .route("/notes/api/notes/archives/:noteId")
    .post(verifyAuth, addNoteToArchives);

archivesRouter
    .route("/notes/api/archives/restore/:noteId")
    .post(verifyAuth, restoreNoteFromArchives);

archivesRouter
    .route("/notes/api/archives/delete/:noteId")
    .delete(verifyAuth, deleteNoteFromArchives);
