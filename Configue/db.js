const mongoose=require("mongoose")
require("dotenv").config()

const connection=mongoose.connect(process.env.MONGO_URL);
console.log(process.env.MONGO_URL,"mongo url")

module.exports={
    connection
}