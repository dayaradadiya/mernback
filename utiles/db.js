const mongoose = require('mongoose');

// module.exports.dbConnect = async() => {
//     try {
//         await mongoose.connect(process.env.DB_URL,{
//          useNewURLParser : true
//             });
//         console.log("database connected...")
//     } catch (error) {
//         console.log(error.message)
//     }
// }



  module.exports.dbconnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {});
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
};

