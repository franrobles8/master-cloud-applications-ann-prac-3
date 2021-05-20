const express = require('express');
const database = require('./database.js');
const booksRouter = require('./routes/bookRouter.js');
const usersRouter = require('./routes/userRouter.js');
const app = express();

//Convert json bodies to JavaScript object
app.use(express.json());
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/users', usersRouter);

async function main() {

    await database.connect();

    app.listen(3000, () => {
        console.log('Server listening on port 3000!');
    });

    process.on('SIGINT', () => {
        database.disconnect();
        console.log('Process terminated');
        process.exit(0);
    });
}

main();