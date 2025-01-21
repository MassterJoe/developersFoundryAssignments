const mongoose = require("mongoose");
const logger = require('../config/logger');

const connectDb = async () => {

    try{

        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`Database connected: ${conn.connection.host}`)
    } catch(error){
    logger.error(`Error connecting database: ${error.message}`, { stack: error.stack });
    }
} 

module.exports = connectDb;  