import express from "express";
//import { checkAuthenticated, checkAdmin } from "../controllers/auth-controllers.js";

import { 
    sendMessage,
    readAllYourReceivedMessages,
    readAllYourSentMessages,
    readMessagesFromUser,
    deleteYourMessage,
    deleteAnyMessage } from "../controllers/messages-controllers.js";

const router = express.Router();

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        next();
    }
    
}

function checkAdmin( req, res, next) {
    if(req.user.role === "admin") {
        next();
    } else {
        res.status(404).json({message: "You do not have admin status"});
    }
}



router.get("/readAllYourSentMessages", checkAuthenticated, readAllYourSentMessages);
router.get("/readAllYourReceivedMessages", checkAuthenticated, readAllYourReceivedMessages);
router.get("/readMessagesFromUser/:id", checkAuthenticated, readMessagesFromUser);
router.post("/SendMessage", checkAuthenticated, sendMessage);
router.delete("/deleteYourMessage/:id", checkAuthenticated, deleteYourMessage);
router.delete("/deleteAnyMessage/:id", checkAuthenticated, checkAdmin, deleteAnyMessage);

export default router;