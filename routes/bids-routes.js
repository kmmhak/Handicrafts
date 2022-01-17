import express from "express";

import {
    ownBids,
    bidsByUser,
    newBid,
    deleteAnyBid } from "../controllers/bids-controllers.js";

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

router.get("/ownBids", checkAuthenticated, ownBids);
router.get("/bidsByUser", bidsByUser);
router.post("/newBid", checkAuthenticated, newBid);
router.delete("/deleteAnyBid", checkAuthenticated, checkAdmin, deleteAnyBid);


export default router;