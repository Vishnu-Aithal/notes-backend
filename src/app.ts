import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";

import { errorHandling } from "./Middlewares/errorHandling";
import { notesRouter } from "./Routes/Private/notes";
import { authRouter } from "./Routes/Public/auth";
import { archivesRouter } from "./Routes/Private/archives";
import { trashRouter } from "./Routes/Private/trash";

const JSONParser = express.json();
const app = express();

app.use(JSONParser);
app.use(helmet());
app.use(cors());

app.use(authRouter);
app.use(notesRouter);
app.use(archivesRouter);
app.use(trashRouter);

app.use(errorHandling);

app.get("/notes/", (req, res) => res.json({ backend: "notes" }));
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 3001);
    })
    .catch((err) => console.log(err));
