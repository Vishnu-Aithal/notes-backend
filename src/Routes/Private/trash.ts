import { Handler, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { UserModelType } from "../../Models/User";

export const trashRouter = Router();

const getAllTrash: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ trash: user.trash });
    } catch (error) {
        next(error);
    }
};

const addNoteToTrash: Handler = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const user: UserModelType = req.user;
        const noteIndex = user.notes.findIndex(
            (note) => note._id?.toString() === noteId
        );
        const [note] = user.notes.splice(noteIndex, 1);
        user.trash.push(note);
        await user.save();
        res.status(201).json({ notes: user.notes, trash: user.trash });
    } catch (error) {
        next(error);
    }
};

const restoreNoteFromTrash: Handler = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const user: UserModelType = req.user;
        const noteIndex = user.trash.findIndex(
            (note) => note._id?.toString() === noteId
        );
        const [note] = user.trash.splice(noteIndex, 1);
        user.notes.push(note);
        await user.save();
        res.status(201).json({ notes: user.notes, trash: user.trash });
    } catch (error) {
        next(error);
    }
};

const deleteNoteFromTrash: Handler = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const user: UserModelType = req.user;
        const noteIndex = user.trash.findIndex(
            (note) => note._id?.toString() === noteId
        );
        user.trash.splice(noteIndex, 1);
        await user.save();
        res.json({ trash: user.trash });
    } catch (error) {
        next(error);
    }
};

trashRouter.route("/notes/api/trash").get(verifyAuth, getAllTrash);

trashRouter
    .route("/notes/api/notes/trash/:noteId")
    .post(verifyAuth, addNoteToTrash);

trashRouter
    .route("/notes/api/trash/restore/:noteId")
    .post(verifyAuth, restoreNoteFromTrash);

trashRouter
    .route("/notes/api/trash/delete/:noteId")
    .delete(verifyAuth, deleteNoteFromTrash);
