import express from "express";
import {
  addFriendsChat,
  approveFriend,
  createFriend,
  getFriendsChat,
  getMyAllCoversations,
  pendingFriendRequest,
  startNewConversation,
  deleteFriendRequest,
  declineFriendRequest,
  getDeclinedRequests
} from "../controllers/friend.controller.js";

const friendRouter = express.Router();

friendRouter.post("/createfriend", createFriend);
friendRouter.post("/addFriendChat", addFriendsChat);
friendRouter.get("/getFriendChat/:cId/:uId", getFriendsChat);
friendRouter.post("/startConversation", startNewConversation);
friendRouter.get("/getMyAllConversations/:uid", getMyAllCoversations);

friendRouter.post("/approveFriend", approveFriend);
friendRouter.post("/deleteFriendRequest", deleteFriendRequest);
friendRouter.post("/declineFriendRequest", declineFriendRequest);
friendRouter.get("/pendingFriendRequest/:id", pendingFriendRequest);
friendRouter.get("/getDeclinedRequests/:id", getDeclinedRequests);

export default friendRouter;
