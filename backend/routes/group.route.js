import express from "express";

import {
  addMemberGroup,
  addMessageGroup,
  createGroup,
  deleteGroup,
  removeMemberGroup,
  groupDetails,
  groupMembers,
  usersGroups,
  upload,
  balanceExpense,
  updateGroup,
  groupMembersAndDetails,
  dismissAdminGroup,
  promoteAdminGroup,
} from "../controllers/group.controller.js";

const uploadMiddleware = upload.single("GroupImage");

const handleImageUpload = (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return next(err);
    }
    // console.log("Image uploaded:", req.file ? req.file.filename : "No image");
    next();
  });
};

const groupRouter = express.Router();
groupRouter.post("/create", upload.single("GroupImage"), createGroup);
groupRouter.post("/addMemberGroup", addMemberGroup);
groupRouter.post("/addMessageGroup", addMessageGroup);
groupRouter.post("/removeMemberGroup", removeMemberGroup);
groupRouter.delete("/delete/:group_id", deleteGroup);
groupRouter.get("/groupDetails/:group_id", groupDetails);
groupRouter.get("/groupMembers/:group_id", groupMembers);
groupRouter.get("/usersGroups/:user_id", usersGroups);
groupRouter.get("/groupBalance/:group_id", balanceExpense);
groupRouter.put("/update/:group_id", handleImageUpload, updateGroup);
groupRouter.get("/groupMembersAndDetails/:group_id", groupMembersAndDetails);
groupRouter.put("/promoteAdminGroup", promoteAdminGroup);
groupRouter.put("/dismissAdminGroup", dismissAdminGroup);

export default groupRouter;
