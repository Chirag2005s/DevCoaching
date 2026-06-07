const mongoose = require("mongoose");

const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://coachingdev072_db_user:Dev2027@devcoaching.lrndrws.mongodb.net/DevCoaching", { tlsAllowInvalidCertificates: true });
        console.log(`\n Mongodb Connected`);
        console.log(`${connectionInstance.connection.host}`);
    }
    catch (err) {
        console.log(`Mongodb connected Error`, err);
        process.exit(1);
    }
}

module.exports = ConnectDB;