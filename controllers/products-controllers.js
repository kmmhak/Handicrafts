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
    const { name, brand, photo, length, unit, color, description, price, product_id } =req.body;
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

export const search = (req, res) => {

    const { lengthMin, lengthMax, priceMin, priceMax, category_id, subcategory_id } =req.body;
    let { name, brand,  color, description } = req.body;

    if(name){
        
        name = "%" + name + "%";

        pool.query(
            `SELECT * 
            FROM products
            WHERE name iLIKE $1`,
            [name],
            (err, results) => {
                if(err) {
                    res.status(500).json({ message: "Sorry, server error"});
                } else {
                    res.status(200).json({ message: results.rows});
                }
                
            }
        );
    } else if(brand){
        
        brand = "%" + brand + "%";
        pool.query(
            `SELECT * 
            FROM products
            WHERE brand iLIKE $1`,
            [brand],
            (err, results) => {
                if(err) {
                    res.status(500).json({ message: "Sorry, server error"});
                } else {
                    res.status(200).json({ message: results.rows});
                }
                
            }
        );
    } else if(lengthMin || lengthMax){
        
        if (lengthMin && lengthMax) {
            
            pool.query(
                `SELECT * 
                FROM products
                WHERE length BETWEEN $1 AND $2`,
                [lengthMin, lengthMax],
                (err, results) => {
                    if(err) {
                        res.status(500).json({ message: "Sorry, server error"});
                    } else {
                        res.status(200).json({ message: results.rows});
                    }
                    
                }
            );

        }
        
        if (lengthMin) {
            
            pool.query(
                `SELECT * 
                FROM products
                WHERE length >= $1`,
                [lengthMin],
                (err, results) => {
                    if(err) {
                        res.status(500).json({ message: "Sorry, server error"});
                    } else {
                        res.status(200).json({ message: results.rows});
                    }
                    
                }
            );
        }

        if (lengthMax) {
            
            pool.query(
                `SELECT * 
                FROM products
                WHERE length <= $1`,
                [lengthMax],
                (err, results) => {
                    if(err) {
                        res.status(500).json({ message: "Sorry, server error"});
                    } else {
                        res.status(200).json({ message: results.rows});
                    }
                    
                }
            );
        }
        

    } else if(color){
        
        color = "%" + color + "%";

        pool.query(
            `SELECT * 
        FROM products
        WHERE color iLIKE $1`,
            [color],
            (err, results) => {
                if(err) {
                    res.status(500).json({ message: "Sorry, server error"});
                } else {
                    res.status(200).json({ message: results.rows});
                }
            
            }
        );
    } else if(description){
    
        description = "%" + description + "%";

        pool.query(
            `SELECT * 
        FROM products
        WHERE description iLIKE $1`,
            [description],
            (err, results) => {
                if(err) {
                    res.status(500).json({ message: "Sorry, server error"});
                } else {
                    res.status(200).json({ message: results.rows});
                }
            
            }
        );
    } else if(priceMin || priceMax){
        
        if (priceMin && priceMax) {
            
            pool.query(
                `SELECT * 
                FROM products
                WHERE price BETWEEN $1 AND $2`,
                [priceMin, priceMax],
                (err, results) => {
                    if(err) {
                        res.status(500).json({ message: "Sorry, server error"});
                    } else {
                        res.status(200).json({ message: results.rows});
                    }
                    
                }
            );

        }
        
        if (priceMin) {
            
            pool.query(
                `SELECT * 
                FROM products
                WHERE price >= $1`,
                [priceMin],
                (err, results) => {
                    if(err) {
                        res.status(500).json({ message: "Sorry, server error"});
                    } else {
                        res.status(200).json({ message: results.rows});
                    }
                    
                }
            );
        }

        if (priceMax) {
            
            pool.query(
                `SELECT * 
                FROM products
                WHERE price <= $1`,
                [priceMax],
                (err, results) => {
                    if(err) {
                        res.status(500).json({ message: "Sorry, server error"});
                    } else {
                        res.status(200).json({ message: results.rows});
                    }
                    
                }
            );
        }


    } else if(category_id){
  
        pool.query(
            `SELECT 
            products.name, 
            brand, 
            photo, 
            length, 
            unit, 
            color, 
            description, 
            price, 
            fk_users_id AS seller, 
            categories.name AS category
            FROM products
            LEFT JOIN categories ON categories.id = products.fk_categories_id
            LEFT JOIN subcategories ON subcategories.id = products.fk_subcategories_id
            WHERE categories.id = $1`,
            [category_id],
            (err, results) => {
                if(err) {
                    res.status(500).json({ message: "Sorry, server error"});
                } else {
                    res.status(200).json({ message: results.rows});
                }
            
            }
        );
    } else if(subcategory_id){
  
        pool.query(
            `SELECT 
            products.name, 
            brand, 
            photo, 
            length, 
            unit, 
            color, 
            description, 
            price, 
            fk_users_id AS seller, 
            categories.name AS category,
            subcategories.name AS subcategories
            FROM products
            LEFT JOIN categories ON categories.id = products.fk_categories_id
            LEFT JOIN subcategories ON subcategories.id = products.fk_subcategories_id
            WHERE categories.id = $1`,
            [subcategory_id],
            (err, results) => {
                if(err) {
                    res.status(500).json({ message: "Sorry, server error"});
                } else {
                    res.status(200).json({ message: results.rows});
                }
            
            }
        );
    }
};