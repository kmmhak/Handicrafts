import pool from "../dbConfig.js";

export const allWares = (req, res) => {
    pool.query(
        `SELECT * 
        FROM products`,
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
            res.status(200).json({message: results.rows});
        }
    );

};

export const waresByUser = (req, res) => {
    const user_id = parseInt(req.params.id);
    
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
};

export const myWares = (req, res) => {
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
};

export const deleteProduct = async (req, res) => {
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
};

export const updateUserProductInfo = (req, res) => {
    const { name, brand, photo, length, unit, color, description, price, product_id } =req.body;
    const fk_categories_id = ~~(req.body.fk_categories_id);
    const fk_subcategories_id = ~~(req.body.fk_subcategories_id);
    
    pool.query(
        `UPDATE products 
            SET name = $1, 
            brand = $2,
            photo = $3, 
            length = $4,
            unit = $5,
            color = $6,
            description = $7,
            price = $8,
            fk_categories_id = $9,
            fk_subcategories_id = $10
            WHERE id = $11`, 
        [name, 
            brand, 
            photo, 
            length, 
            unit, 
            color, 
            description, 
            price, fk_categories_id, 
            fk_subcategories_id, product_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            } else {
                res.status(200).json({message: "product information changed successfully"});
            }
        
        }
    ); 
};

export const deleteAnyProduct = (req, res) => {
    const product_id = parseInt(req.params.id);

    pool.query(
        `DELETE FROM products
        WHERE id = $1`,
        [product_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ message: `Could not delete product with id ${product_id}`});
            } else {
                res.status(200).json({message: `You deleted the product with id ${product_id}` });
            }
        }
    );
};


export const updateYourProductInfo = async (req, res) => {
    const{ name, brand, photo, length, unit, color, description, price, product_id } =req.body;
    const fk_categories_id = ~~(req.body.fk_categories_id);
    const fk_subcategories_id = ~~(req.body.fk_subcategories_id);
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

        if (user_id === pool_user_id){
            
            pool.query(
                `UPDATE products 
                    SET name = $1, 
                    brand = $2,
                    photo = $3, 
                    length = $4,
                    unit = $5,
                    color = $6,
                    description = $7,
                    price = $8,
                    fk_categories_id = $9,
                    fk_subcategories_id = $10
                    WHERE id = $11`, 
                [name, 
                    brand, 
                    photo, 
                    length, 
                    unit, 
                    color, 
                    description, 
                    price, 
                    fk_categories_id, 
                    fk_subcategories_id, 
                    product_id],
                (err, results) => {
                    if (err) {
                        res.status(500).json({message: "Sorry, server error"});
                    } else {
                        res.status(200).json({message: "product information changed successfully"});
                    }
                
                }
            ); 
        } else {
            res.status(404).json({message: "Sorry, you can only change your own products"});
        }   
        
        
    } 
};


export const newProduct = (req, res) => {
    const { name, 
        brand, 
        photo, 
        length, 
        unit, 
        color,
        description, 
        price, 
        category, 
        subcategory } =req.body;
    const user_id = req.user.id;
 
    
    pool.query(
        `INSERT INTO products 
        (name, 
            brand, 
            photo, 
            length, 
            unit, 
            color, 
            description, 
            price, 
            fk_categories_id, 
            fk_subcategories_id, 
            fk_users_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, 
        [name, 
            brand, 
            photo, 
            length, 
            unit, 
            color,
            description, 
            price, 
            category, 
            subcategory, 
            user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Sorry, server error"});
            }
        
            res.status(200).json({message: "product added successfully"});
        }
    ); 
};
