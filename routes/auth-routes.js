import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {jwtTokens} from "../utils/jwt-helpers.js";


const router = express.Router();


router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const users = await pool.query("SELECT * FROM client WHERE username = $1", [username]);
        if(users.rows.length === 0) return res.status(401).json({error : "Email is incorrect"});
        //PASSWORD CHECK
        const validPassword = await bcrypt.compare(password, users.rows[0].password);
        if(!validPassword) return res.status(401).json({error: "incorrect password"});
        //JWT
        let tokens = jwtTokens(users.rows[0]);
        res.cookie("refresh_token", tokens.refreshToken,{httpOnly:true});
        res.json(tokens); 
    
    } catch (error) {
        res.status(401).json({error:error.message});
    }
});



router.get("/products", async (req, res) => {
    try{
        const products = await pool.query("SELECT * FROM product");
        res.json({products : products.rows});        
    } catch (error){
        res.status(500).json({error:error.message});        
    }
});

router.get("/categories", async (req, res) => {
    try{
        const categories = await pool.query("SELECT category_name FROM category");
        res.json({categories: categories.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});
/*
router.get("/categories/products", (req, res) => {
    
    const id = parseInt(req.params.id);
    pool.query("select * from product left join category on category_id = fk_category_id where category_id = $1", [id], (error, results) =>{
        if (error) {
            res.status(500).json({error:error.message});
        }
    
        res.status(200).json(results.rows); 
    });       
   
}); */



// https://www.youtube.com/watch?v=foL7tbTrS9E 1:25:00
/*
router.get("/refresh_token", (req, res) => {
    try{
        const refreshToken = req.cookies.refresh_token;
        if(refreshToken === null) return res.status(401).json({error: "Null refresh token"});
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if(error) return res.status(403).json({error: error.message});
            let tokens = jwtTokens(user);
            res.cookie("refresh_token", tokens.refreshToken,{httpOnly:true});
            res.json(tokens);
        });
        
        console.log(refreshToken);
    } catch (error) {
        res.status(401).json({error:error.message});
    }
}); */
/*
router.delete("/refresh_token", (req, res) => {
    try{
        res.clearCookie("refresh_token");
        return res.status(200).json({message: "refresh token deleted"});
    } catch (error) {
        res.status(401).json({error:error.message});
    }
});*/


export default router;