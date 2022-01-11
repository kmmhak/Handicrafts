import express from "express";
import dotenv from "dotenv";
dotenv.config();
import pool from "./dbConfig.js";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import initializePassport from "./passportConfig.js";

const app = express();

initializePassport(passport);

const PORT = process.env.PORT || 4000 ;


app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
    
        resave: false,

        saveUninitialized: false

    })
);
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.status(200).json({message: "Welcome"});
});



app.get("/users/myPage", checkAuthenticated,(req, res) => {
    res.status(200).json({message: `welcome to your page ${req.user.email}`});
});

app.get("/users/myWares", checkAuthenticated, (req, res) => {
    const user_id = req.user.id;
    
    pool.query(
        `SELECT * 
        FROM products
        WHERE fk_users_id = $1`,
        [user_id], 
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
            res.status(200).json({message: results.rows});
        }
    );
        
    
});

app.get("/users/waresByUser", (req, res) => {
    const user_id = req.body.id;
    
    pool.query(
        `SELECT * 
        FROM products
        WHERE fk_users_id = $1`,
        [user_id], 
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
            res.status(200).json({message: results.rows});
        }
    );
        
    
});

app.get("/users/ownBids", checkAuthenticated, (req, res) => {
    const user_id = req.user.id;
    
    pool.query(
        `SELECT * 
        FROM bids
        WHERE fk_users_id = $1`,
        [user_id], 
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
            res.status(200).json({message: results.rows});
        }
    );
        
    
});

app.get("/users/bidsByUser", (req, res) => {
    const user_id = req.body.id;
    
    pool.query(
        `SELECT * 
        FROM bids
        WHERE fk_users_id = $1`,
        [user_id], 
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
            res.status(200).json({message: results.rows});
        }
    );
        
    
});

app.post("/users/newBid", checkAuthenticated, (req, res) => {
    const user_id = req.user.id;
    const product_id = req.body.id;
    const now = new Date();
    
    pool.query(
        `INSERT INTO bids
        (fk_products_id, fk_users_id, bid_time)
        VALUES ($1, $2, $3)`,
        [product_id, user_id, now],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
        
            res.status(200).json({message: "bid added successfully"});
        }
    ); 
});

app.post("/users/newProduct", checkAuthenticated, (req, res) => {
    const { name, brand, photo, length, unit, color,description, price, category, subcategory } =req.body;
    const user_id = req.user.id;
 
    
    pool.query(
        `INSERT INTO products 
        (name, brand, photo, length, unit, color, description, price, fk_categories_id, fk_subcategories_id, fk_users_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, 
        [name, brand, photo, length, unit, color,description, price, category, subcategory, user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
        
            res.status(200).json({message: "product added successfully"});
        }
    ); 
});

app.delete("/users/deleteProduct", checkAuthenticated, async (req, res) => {
    const product_id = req.body.id;
    const user_id = ~~(req.user.id);
    
    const response = await pool.query(
        `SELECT * FROM products
            WHERE id = $1`,
        [product_id]).catch((err) => {
        console.error(err);
    });

    if (response.rows.length === 0) {
        res.status(404).json({message: "Sorry, could not find product"});
    } else {
                
        const pool_user_id = response.rows[0].fk_users_id;

        if (user_id === pool_user_id) {
        
            pool.query(
                `DELETE FROM products
            WHERE id = $1`,
                [product_id],
                (err, results) => {
                    if (err) {
                        res.status(500).json({message: "Sorry, server error"});
                    } else {
                        res.status(200).json({message: `Product with id ${product_id} deleted`});
                    }
                }
            
            );
        } else {
            res.status(404).json({message: "Sorry, you can only delete your own products"});
        }
    }
});



app.delete("/users/deleteUser", checkAuthenticated, (req, res) => {
    const user_id = req.user.id;

    pool.query(
        `DELETE FROM users
        WHERE id = $1`,
        [user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ message: "Could not delete your user account"});
            } else {
                res.status(200).json({message: "Your account was deleted"});
            }
        }
    );
});

app.get("/users/logout", (req, res) => {
    req.logout();
    res.status(200).json({ message: "You have logged out successfully" });
});

app.post("/users/register", async (req, res) => {
    let {name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
        res.status(400).json({ message: "Please enter all fields" });
    }

    if(password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
        res.status(400).json({ message: "Password should be at least 6 characters"});
    }

    if(password != password2) {
        errors.push({ message: "Passwords do not match" });
        res.status(400).json({ message: "Passwords do not match"});
    }
    if(errors.length > 0) {
        res.status(400).json({message: "errors occured"});
    } else {
        //Form validation has passed
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        pool.query(
            `SELECT * FROM users 
            WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }
             
                console.log(results.rows);

                if(results.rows.length > 0) {
                    res.status(400).json({message: "Email already in use"});
                   
                } else {
                    const role = "regular";
                    pool.query(
                        `INSERT INTO users (name, email, password, role)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id, password`, 
                        [name, email, hashedPassword, role], 
                        (err, results) => {
                            if(err) {
                                throw err;
                            }
                            
                            res.status(200).json({message: "registered"});

                        }
                        
                    );
                    
                }

            
            }
        );
    }
    

});

app.post(
    "/users/login", 
    passport.authenticate("local", {
        successRedirect: "/users/myPage",
        //failureRedirect: "/users/login",
     
    })

); 

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        next();
    }
    
}
/*
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //res.redirect("/users/login");
} */

app.listen(PORT, () => {
    console.log( `Server running on port ${PORT}`);
});