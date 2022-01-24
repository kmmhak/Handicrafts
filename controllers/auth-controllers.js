import pool from "../dbConfig.js";
import bcrypt from "bcrypt";
import passport from "passport";


export const register = async (req, res) => {
    let {name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    });

    if(!name || !email || !password || !password2) {
        res.status(400).json({ message: "Please enter all fields" });
    }

    if(password.length < 6) {
        res.status(400).json({ message: "Password should be at least 6 characters"});
    }

    if(password != password2) {
        res.status(400).json({ message: "Passwords do not match"});
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
};

export const login =
    passport.authenticate("local", {
        successRedirect: "/users/myPage",
 
    });

export const logout = (req, res) => {
    req.logout();
    res.status(200).json({ message: "You have successfully logged out" });
};