

export function checkAuthenticated() { (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    }   
};
}


export function checkAdmin() { (req, res, next) => {
    if(req.user.role === "admin") {
        next();
    } else {
        res.status(404).json({message: "You do not have admin status"});
    }
};
}