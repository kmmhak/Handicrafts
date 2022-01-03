import express, { response } from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({info: "Kauppa on auki"});
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
