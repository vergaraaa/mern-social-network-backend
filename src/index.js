const cors = require('cors');
const express = require('express');
const dbConnection = require("./database/connection");
const morgan = require('morgan');

// db connection
dbConnection();

// create node server
const port = 4000 || process.env.PORT;
const app = express();

// setup cors
app.use(cors());

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// test route
app.get("/test", (req, res) => {
    return res.status(200).json({
        name: "Edgar Vergara"
    });
});

// load routes
app.use("/api/users/", require("./routes/user"));
app.use("/api/follows/", require("./routes/follow"));
app.use("/api/posts/", require("./routes/post"));

// run server
app.listen(port, () => {
    console.log("listening on port " + port);
});