import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {jwtTokens} from "../utils/jwt-helpers.js";

export const index = (req, res) => {
    res.send(200).json({message: "Welcome!"});
};

export const getProducts = async (req, res) => {
    try{
        const products = await pool.query("SELECT * FROM product");
        res.json({products: products.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}; 

export const registerClient = async (req, res) => {
    try{
        const role = "regular";
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newClient = await pool.query("INSERT INTO client (client_fname, client_lname, client_email, username, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.body.fname, req.body.lname, req.body.email, req.body.username, hashedPassword, role]);
        res.json({Client: newClient.rows[0]});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};

