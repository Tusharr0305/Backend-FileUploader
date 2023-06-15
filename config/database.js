const mongoose=require("mongoose");

require("dotenv").config();

exports.connect= ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true,

        // useNewUrlParser: true,
        // useUnifiedTopology: true,

    })
    .then(console.log("DB connection sucessfull"))
    .catch((error)=>{
        console.log("DB Connection Issues");
        console.error(error);
        process.exit(1);
    })
}