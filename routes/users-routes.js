import express from "express";
//import { checkAuthenticated, checkAdmin } from "../controllers/auth-controllers.js";

import { 
    myPage, 
    deleteUser,
    updateYourInfo,
    changeUserRole,
    deleteAnyUser } from "../controllers/users-controllers.js";

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





router.get("/myPage", checkAuthenticated, myPage);
router.delete("/deleteUser", checkAuthenticated, deleteUser);
router.put("/updateYourInfo", checkAuthenticated, updateYourInfo);
router.put("/changeUserRole", checkAuthenticated, checkAdmin, changeUserRole);
router.delete("/deleteAnyUser", checkAuthenticated, checkAdmin, deleteAnyUser);



export default router;

