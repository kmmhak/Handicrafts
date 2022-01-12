import express from "express";
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import passport from "passport";
import initializePassport from "./passportConfig.js";

import usersRouter from "./routes/users-routes.js";

const app = express();

initializePassport(passport);

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome" });
});

app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
