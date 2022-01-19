
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

export const myPage = (req, res) => {
    res.status(200).json({message: `welcome to your page ${req.user.name}`});
};

export const logout = (req, res) => {
    req.logout();
    res.status(200).json({ message: "You have successfully logged out" });
};

export const deleteUser = (req, res) => {
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
};

export const updateYourInfo = async (req, res) => {
    const user_id = req.user.id;
    const { name, email, password, password2 } =req.body;
    
    if(name){
        
        pool.query(
            `UPDATE users
            SET name = $1
            WHERE id = $2`,
            [name, user_id],
            (err, results) => {
                if(err) {
                    res.status(500).json({ message: "Could not update your name"});
                } 
                
            }
        );
    }
    
    if(email) {
        
        const response = await pool.query(
            `SELECT * FROM users
                WHERE email = $1`,
            [email]).catch((err) => {
            console.error(err);
        });

        if (response.rows.length > 0) {
            
            res.status(400).json({message: "Email already in use"});
        } else {

            pool.query(
                `UPDATE users
                SET email = $1
                WHERE id = $2`,
                [email, user_id],
                (err, results) => {
                    if(err) {
                        res.status(500).json({ message: "Could not update your email"});
                    } 
                    
                }
            );
        }  
    }
    
    if(password) {

        if (!password2) {
            res.status(400).json({ message: "Type in both passwords"});
        }
        if (!(password === password2)) {
            res.status(400).json({ message: "Passwords do not match"});
        } else {
            
            let hashedPassword = await bcrypt.hash(password, 10);
            
            pool.query(
                `UPDATE users
                SET password = $1
                WHERE id = $2`,
                [hashedPassword, user_id],
                (err, results) => {
                    if(err) {
                        res.status(400).json({ message: "Could not change password"});
                    }
                }
                
            ); 
        }
    } 
    res.status(200).json({ message: "You have updated your information successfully" });

};

export const changeUserRole = (req, res) => {
    const user_id = ~~(req.body.id);
    const role = req.body.role;

    pool.query(
        `UPDATE users
        SET role = $1
        WHERE id = $2`,
        [role, user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            } else {
                res.status(200).json({message: `User role successfully changed to ${role}`});
            }
        }
    );
};

export const deleteAnyUser = (req, res) => {
    const user_id = parseInt(req.params.id);

    pool.query(
        `DELETE FROM users
        WHERE id = $1`,
        [user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ message: "Could not delete user account"});
            } else {
                res.status(200).json({message: `You deleted the user with id ${user_id}` });
            }
        }
    );
};
