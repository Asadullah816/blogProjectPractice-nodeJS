const mongoose = require('mongoose')

const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false)
        const connect = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Database connected successfully ${connect.connection.host}`);
    } catch (err) {
        console.log(err);
    }
}
module.exports = dbConnect;