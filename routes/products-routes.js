import express from "express";

import {
    allWares,
    waresByUser,
    myWares,
    deleteProduct,
    updateUserProductInfo,
    deleteAnyProduct,
    updateYourProductInfo,
    newProduct } from "../controllers/products-controllers.js";

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

router.get("/allWares", allWares);
router.get("/waresByUser", waresByUser);
router.get("/myWares", checkAuthenticated, myWares);
router.post("/newProduct", checkAuthenticated, newProduct);
router.delete("/deleteProduct", checkAuthenticated, deleteProduct);
router.delete("/deleteAnyProduct", checkAuthenticated, checkAdmin, deleteAnyProduct);
router.put("/updateYourProductInfo", checkAuthenticated, updateYourProductInfo);
router.put("/updateUserProductInfo", checkAuthenticated, checkAdmin, updateUserProductInfo);


export default router;