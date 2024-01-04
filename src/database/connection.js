const { default: mongoose } = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mern-social-network");
        console.log("db connected");
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = connection;