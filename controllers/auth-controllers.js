import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
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
};