const express = require("express");
const sequelize = require("./db/db.js");
const cors = require("cors");
const fileUpload = require("express-fileupload")
const path = require("path");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
require("dotenv").config({path: path.join(__dirname, '../.env')})

console.log(process.env.TOKEN_SECRET_KEY);

const router = require("./routes/index.js");

const app = express();

app.use(cors({credentials: true, origin: process.env.API_URL}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "static")))
app.use(fileUpload({}));

app.use('/api', router)

app.get("/", (req, res) => {
    res.status(200).json({message: "it's working!!"})
})


const start = async() => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({force: true});
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    } catch(e) {
        console.log(e);
    }
}

start()
