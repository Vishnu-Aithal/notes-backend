import { Handler, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { Todo } from "../../Models/Todo";
import { UserModelType } from "../../Models/User";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";

export const todosRouter = Router();

const getAllTodos: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ todos: user.todos });
    } catch (error) {
        next(error);
    }
};

const addNewTodo: Handler = async (req, res, next) => {
    try {
        const { todo } = req.body;
        const user: UserModelType = req.user;
        user.todos.push(new Todo(todo));
        await user.save();
        res.status(201).json({ todos: user.todos });
    } catch (error) {
        next(error);
    }
};

const updateTodo: Handler = async (req, res, next) => {
    try {
        const { todoId } = req.params;
        const { todo } = req.body;
        const user: UserModelType = req.user;
        const todoIndex = user.todos.findIndex(
            (todo) => todo._id?.toString() === todoId
        );

        try {
            user.todos[todoIndex].name =
                todo.name ?? user.todos[todoIndex].name;
            user.todos[todoIndex].status =
                todo.status ?? user.todos[todoIndex].status;
        } catch (error) {
            throw errorMessageWithCode("bad request body", 400);
        }
        await user.save();
        res.json({ todos: user.todos });
    } catch (error) {
        next(error);
    }
};

const deleteTodo: Handler = async (req, res, next) => {
    try {
        const { todoId } = req.params;
        const user: UserModelType = req.user;
        const todoIndex = user.todos.findIndex(
            (todo) => todo._id?.toString() === todoId
        );
        user.todos.splice(todoIndex, 1);
        await user.save();
        res.json({ todos: user.todos });
    } catch (error) {
        next(error);
    }
};

todosRouter
    .route("/notes/api/todos")
    .get(verifyAuth, getAllTodos)
    .post(verifyAuth, addNewTodo);
todosRouter
    .route("/notes/api/todos/:todoId")
    .post(verifyAuth, updateTodo)
    .delete(verifyAuth, deleteTodo);
