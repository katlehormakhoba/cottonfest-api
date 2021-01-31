const dotenv = require('dotenv'); //FOR READING .env file
dotenv.config({ path: './.env' }); //FOR GETTING PATH OF .env file
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

(async () => {
    try {
        await mongoose
            .connect(DB, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
        console.log('DB connected successfully');
    } catch (err) {
        console.log(err);
    }
})()


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`app is running on ${PORT}...`);
})


process.on('unhandledRejection', err => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection',err.name,'-', err.message);
});
