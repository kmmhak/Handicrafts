import express from "express";

import {
    ownBids,
    bidsByUser,
    newBid,
    deleteAnyBid } from "../controllers/bids-controllers.js";

import { checkAuthenticated, checkAdmin } from "../middleware/middleware.js";

const router = express.Router();


router.get("/ownBids", checkAuthenticated, ownBids);
router.get("/bidsByUser/:id", bidsByUser);
router.post("/newBid", checkAuthenticated, newBid);
router.delete("/deleteAnyBid/:id", checkAuthenticated, checkAdmin, deleteAnyBid);


export default router;