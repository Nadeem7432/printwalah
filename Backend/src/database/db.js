const mongoose = require('mongoose')

const mongoDB = async () => {

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected")
}

module.exports = mongoDB