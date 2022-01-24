import express from "express";
//import { checkAuthenticated, checkAdmin } from "../controllers/auth-controllers.js";

import { 
    myPage, 
    deleteUser,
    updateYourInfo,
    changeUserRole,
    deleteAnyUser } from "../controllers/users-controllers.js";

import { checkAuthenticated, checkAdmin } from "../middleware/middleware.js";

const router = express.Router();

router.get("/myPage", checkAuthenticated, myPage);
router.delete("/deleteUser", checkAuthenticated, deleteUser);
router.put("/updateYourInfo", checkAuthenticated, updateYourInfo);
router.put("/changeUserRole", checkAuthenticated, checkAdmin, changeUserRole);
router.delete("/deleteAnyUser/:id", checkAuthenticated, checkAdmin, deleteAnyUser);

export default router;

