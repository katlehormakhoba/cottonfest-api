const validator = require('validator');


const name = "katleho";
const date = Date.now();
const lastname = "makhoba";

// console.log(validator.equals('katleho',name));
console.log(validator.isEmail('Kat'));

const email = { "$gt": "" };
console.log(typeof (email) === "bject")

// console.log(validator.isAfter('2020/11/11','2020/10/11'));


class apiErrors extends Error {
    constructor(status, message) {
        this.status = status;
        this.message = message
    }


}

let DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

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
        if (err.code === 'ECONNREFUSED') {
            
            DB = process.env.DATABASE_LOCAL.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

            await mongoose
                .connect(DB, {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    useUnifiedTopology: true
                });
            console.log('LOCAL DB connected successfully');
        }
    }
})()








