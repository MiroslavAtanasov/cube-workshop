const env = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose')
const config = require('./config/config')[env];
const express = require('express')
const indexRouter = require('./routes')
const authRouter = require('./routes/auth')
const cubeRouter = require('./routes/cube')
const accessoryRouter = require('./routes/accessory')
const app = express();

mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log('Database setup and running');
})

require('./config/express')(app);

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/', cubeRouter)
app.use('/', accessoryRouter)

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error | Cube Workshop'
    })
})

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));