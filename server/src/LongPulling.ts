import express from "express";
import cors from "cors";
import * as events from "events";

const app = express();

const emitter = new events.EventEmitter();

const port = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hei");
});

app.get("/get-messages", (_, res) => {
  emitter.once("newMessage", (message) => {
    res.json(message);
  });
});

app.post("/new-messages", (req, res) => {
  const message = req.body;
  emitter.emit("newMessage", message);
  res.status(200);
});

app.listen(port, (): void => {
  return console.log(`Server listen on port - ${port}`);
});
