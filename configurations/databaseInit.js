const mongoose = require("mongoose");

const mongodb_url = process.env.MONGODB_URL;

async function initDb() {
    try {
        await mongoose.connect(mongodb_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected");
    } catch (error) {
        console.error("Error connecting to database:", error.message);
    }
}

module.exports = { initDb };
