import pool from "../dbConfig.js";

export const ownBids = (req, res) => {
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
};


export const bidsByUser = (req, res) => {
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
};

export const newBid = (req, res) => {
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
            
            const array = [];
            let position_in_queue = 0;
            
            pool.query(
                `SELECT * from bids
                WHERE fk_products_id = $1
                ORDER BY fk_products_id asc`,
                [product_id],
                (err, results) => {
                    if(err) {
                        res.status(500).json({message: "Sorry, server error yet again"});
                    } else {
                        array.push(results.rows);
                        console.log(array[0].length);
                        
                        if (array[0].length === 1) {
                            res.status(200).json({message: "you are the first to place a bid on this product"});
                        } else {
                            position_in_queue = (array[0].length - 1);
                            res.status(200).json({message: `You are in queue number ${position_in_queue} for this product`});
                        }
                            
                    }
                }
            );

            
        }
    ); 
};


export const deleteAnyBid = (req, res) => {
    const bid_id = req.body.id;

    pool.query(
        `DELETE FROM bids
        WHERE id = $1`,
        [bid_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ message: `Could not delete bid with id ${bid_id}`});
            } else {
                res.status(200).json({message: `You deleted the bid with id ${bid_id}`});
            }
        }
    );
};



/*
export const placeInQueue = async (req, res) => {
    const product_id = ~~(req.body.id);
    const user_id = ~~(req.user.id);

    const response = await pool.query(
        `SELECT * FROM bids
            WHERE fk_products_id = $1`,
        [product_id]).catch((err) => {
        console.error(err);
    });

    if (response.rows.length === 0) {
        res.status(404).json ({message: `Sorry, there are no bids on product number ${product_id}`});
    } else {

    }z
};
*/ 