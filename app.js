const express = require('express');
const app = express();
const morgan = require('morgan');
const body_parser = require('body-parser');

const rotaCeps = require('./routes/ceps');

app.use(morgan('dev'));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
        return res.status(200).send({});
    }

    next();
});

app.use('/ceps', rotaCeps);
// app.use('/ceps/:id-cep', rotaCeps);

app.use((req, res, next) => {
    const error = new Error('Não encontrado');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        error: {
            message: error.message
        }
    })
});

module.exports = app;