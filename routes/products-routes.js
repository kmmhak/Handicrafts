import express from "express";

import {
    allWares,
    waresByUser,
    myWares,
    deleteProduct,
    updateUserProductInfo,
    deleteAnyProduct,
    updateYourProductInfo,
    newProduct,
    search } from "../controllers/products-controllers.js";

import { checkAuthenticated, checkAdmin } from "../middleware/middleware.js";

const router = express.Router();

router.get("/search", search);
router.get("/allWares", allWares);
router.get("/waresByUser/:id", waresByUser);
router.get("/myWares", checkAuthenticated, myWares);
router.post("/newProduct", checkAuthenticated, newProduct);
router.delete("/deleteProduct", checkAuthenticated, deleteProduct);
router.delete("/deleteAnyProduct/:id", checkAuthenticated, checkAdmin, deleteAnyProduct);
router.put("/updateYourProductInfo", checkAuthenticated, updateYourProductInfo);
router.put("/updateUserProductInfo", checkAuthenticated, checkAdmin, updateUserProductInfo);

export default router;