const mongoose = require('mongoose');
const { dbUrl } = require('../../config/backend');

const connect = async () => {
    try {
       let uri = dbUrl;
       await mongoose.connect(uri);
       console.log('mongodb Connected......');
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
}
module.exports = connect;