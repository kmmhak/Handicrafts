import express from "express";
//import { checkAuthenticated, checkAdmin } from "../controllers/auth-controllers.js";

import { 
    sendMessage,
    readAllYourReceivedMessages,
    readAllYourSentMessages,
    readMessagesFromUser,
    deleteYourMessage,
    deleteAnyMessage } from "../controllers/messages-controllers.js";

import { checkAuthenticated, checkAdmin } from "../middleware/middleware.js";

const router = express.Router();

router.get("/readAllYourSentMessages", checkAuthenticated, readAllYourSentMessages);
router.get("/readAllYourReceivedMessages", checkAuthenticated, readAllYourReceivedMessages);
router.get("/readMessagesFromUser/:id", checkAuthenticated, readMessagesFromUser);
router.post("/SendMessage", checkAuthenticated, sendMessage);
router.delete("/deleteYourMessage/:id", checkAuthenticated, deleteYourMessage);
router.delete("/deleteAnyMessage/:id", checkAuthenticated, checkAdmin, deleteAnyMessage);

export default router;