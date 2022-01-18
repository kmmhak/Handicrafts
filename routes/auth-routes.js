import express from "express";

import { 
    register, 
    login, 
    logout } from "../controllers/auth-controllers.js";

const router = express.Router();


export function checkAuthenticated() { (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    }   
};
}


export function checkAdmin() { (req, res, next) => {
    if(req.user.role === "admin") {
        next();
    } else {
        res.status(404).json({message: "You do not have admin status"});
    }
};
}


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);


export default router;