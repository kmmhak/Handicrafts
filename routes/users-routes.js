import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
//import {authenticateToken} from "../middleware/authorization.js";
import { getProducts, registerClient } from "../controllers/user-controllers.js";

const router = express.Router();

router.get("/products", getProducts); //Myös kirjautumattomat käyttäjät voivat nähdä kaikki tuotteet

/*

router.get("/products", async (req, res) => {
    try{
        const users = await pool.query("SELECT * FROM product");
        res.json({users : users.rows});        
    } catch (error){
        res.status(500).json({error:error.message});        
    }
}); 
*/
/*
router.get("/", authenticateToken, async (req, res) => {
    try{
        const users = await pool.query("SELECT * FROM product");
        res.json({users : users.rows});        
    } catch (error){
        res.status(500).json({error:error.message});        
    }
}); */
router.post("/register", registerClient);
/*
router.post("/register", async (req, res) => {
    try{
        const role = "regular";
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newClient = await pool.query("INSERT INTO client (client_fname, client_lname, client_email, username, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.body.fname, req.body.lname, req.body.email, req.body.username, hashedPassword, role]);
        res.json({Client: newClient.rows[0]});
    } catch (error){
        res.status(500).json({error:error.message});
    }
});*/

export default router;