const mongoose = require("mongoose");
let resourceBucket;

const initResourceBucket = () => {
    const conn = mongoose.connection;
    if (!conn) throw new Error("MongoDB connection not ready");

    resourceBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "researchFiles",
    });
};

const getResourceBucket = () => resourceBucket;

module.exports = { initResourceBucket, getResourceBucket };
