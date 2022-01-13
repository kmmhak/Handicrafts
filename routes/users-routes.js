import express from "express";

import {
    waresByUser,
    myPage,
    register,
    login,
    myWares,
    ownBids,
    bidsByUser,
    newBid,
    newProduct,
    deleteProduct,
    deleteUser,
    updateYourInfo,
    updateYourProductInfo,
    updateUserProductInfo,
    changeUserRole,
    logout,
    deleteAnyUser,
    deleteAnyProduct,
    deleteAnyBid,
} from "../controllers/users-controllers.js";

const router = express.Router();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
}

function checkAdmin(req, res, next) {
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(404).json({ message: "You do not have admin status" });
    }
}

router.post("/register", register);
router.post("/login", login);

router.get("/myPage", checkAuthenticated, myPage);
router.get("/waresByUser", waresByUser);
router.get("/myWares", checkAuthenticated, myWares);
router.get("/ownBids", checkAuthenticated, ownBids);
router.get("/bidsByUser", bidsByUser);
router.get("/logout", logout);

router.post("/newProduct", checkAuthenticated, newProduct);
router.post("/newBid", checkAuthenticated, newBid);

router.delete("/deleteProduct", checkAuthenticated, deleteProduct);
router.delete("/deleteUser", checkAuthenticated, deleteUser);

router.put("/updateYourInfo", checkAuthenticated, updateYourInfo);
router.put("/updateYourProductInfo", checkAuthenticated, updateYourProductInfo);

router.put(
    "/updateUserProductInfo",
    checkAuthenticated,
    checkAdmin,
    updateUserProductInfo
);
router.put("/changeUserRole", checkAuthenticated, checkAdmin, changeUserRole);

router.delete("/deleteAnyUser", checkAuthenticated, checkAdmin, deleteAnyUser);
router.delete(
    "/deleteAnyProduct",
    checkAuthenticated,
    checkAdmin,
    deleteAnyProduct
);
router.delete("/deleteAnyBid", checkAuthenticated, checkAdmin, deleteAnyBid);

export default router;
