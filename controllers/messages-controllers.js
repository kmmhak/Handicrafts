
import pool from "../dbConfig.js";

export const sendMessage = async (req, res) => {
    const created = new Date();
    const fk_sender_id = req.user.id;
    const { subject, message, fk_products_id } = req.body;

    const response = await pool.query(
        `SELECT * FROM products
            WHERE id = $1`,
        [fk_products_id]).catch((err) => {
        console.error(err);
    });
    const fk_recipient_id = response.rows[0].fk_users_id;

    pool.query(
        `INSERT INTO messages
        (subject, message, fk_products_id, fk_sender_id, fk_recipient_id, created)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [subject, message, fk_products_id, fk_sender_id, fk_recipient_id, created],
        (err, results) => {
            if (err) {
                res.status(500).json({ message: "Could not send message"});
            } else {
                res.status(200).json({message: `Your message has been sent to the user id ${fk_recipient_id} about product id ${fk_products_id}` });
            }
        }
    ); 
    
};

export const readAllYourReceivedMessages = (req, res) => {
    const user_id = req.user.id;

    pool.query(
        `SELECT fk_sender_id as sender, subject, message, created 
        FROM messages
        WHERE fk_recipient_id = $1
        ORDER BY created DESC`,
        [user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Could not retrieve your messages"});
            } else {
                res.status(200).json({message: results.rows});
            }
        }
    );
};

export const readAllYourSentMessages = (req, res) => {
    const user_id = req.user.id;

    pool.query(
        `SELECT fk_sender_id AS sender, subject, message, created 
        FROM messages
        WHERE fk_sender_id = $1
        ORDER BY created DESC`,
        [user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Could not retrieve your messages"});
            } else {
                res.status(200).json({message: results.rows});
            }
        }
    );
};


export const readMessagesFromUser = (req, res) => {
    const user_id = req.user.id;
    const sender_id = parseInt(req.params.id);
 
    pool.query(
        `SELECT fk_sender_id AS sender, subject, message, created 
        FROM messages
        WHERE fk_sender_id = $1 AND fk_recipient_id = $2
        ORDER BY created DESC`,
        [sender_id, user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Could not retrieve your messages"});
            } else {
                res.status(200).json({message: results.rows});
            }
        }
    ); 
};

export const deleteYourMessage = async (req, res) => {
    const user_id = req.user.id;
    const message_id = parseInt(req.params.id);

    const response = await pool.query(
        `SELECT * FROM messages
            WHERE fk_sender_id = $1
            OR fk_recipient_id = $1`,
        [user_id]).catch((err) => {
        console.error(err);
    });

    if(response.rows.length <= 0) {
        res.status(400).json({message: "You cannot delete someone else's message"});
    } else {
    
        pool.query(
            `DELETE FROM messages
            WHERE id = $1`,
            [message_id],
            (err, results) => {
                if (err) {
                    res.status(500).json({message: "Could not delete the message"});
                } else {
                    res.status(200).json({message: `Removed message id ${message_id}`});
                }
            }
        );
    }
};

export const deleteAnyMessage = (req, res) => {
    const message_id = parseInt(req.params.id);

    pool.query(
        `DELETE FROM messages
        WHERE id = $1`,
        [message_id],
        (err, results) => {
            if (err) {
                res.status(500).json({message: "Could not delete the message"});
            } else {
                res.status(200).json({message: `Removed message id ${message_id}`});
            }
        }
    );
};