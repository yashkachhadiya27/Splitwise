import express from "express";
import {
  addMessage, 
  getAllMessages
} from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post('/addmessage', addMessage)
chatRouter.get('/getAllMessages/:c_id', getAllMessages)

export default chatRouter;
