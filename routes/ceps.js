const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const axios = require('axios');

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { res.status(500).send({ error: error }); }

        conn.query(
            'SELECT * FROM numeros;',
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error, response: null
                    });
                }
                return res.status(200).send({
                    response: resultado
                });
            }
        );
    });
});

router.post('/', function (req, res, next) {
    if (error) { res.status(500).send({ error: error }); }

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO numeros (numero) VALUES (?);',
            req.body.numero,
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error, response: null
                    });
                }

                res.status(201).send({
                    mensagem: 'Cep Criado com sucesso!',
                    id_cep: resultado.insertId
                });
            }
        );
    });
});

router.get('/:id', (req, res, next) => {
   
    let urlCep = `https://viacep.com.br/`;    
    const apiCep = axios.create({
        baseURL: urlCep
    });

    mysql.getConnection((error, conn) => {
        if (error) { res.status(500).send({ error: error }); }

        conn.query(
            'SELECT * FROM numeros WHERE id = ?;',
            req.params.id,
            (error, resultado, field) => {
                // console.log(resultado)
                apiCep
                .get(`ws/${resultado[0].numero}/json/`)
                .then(result => {
                    let data = result.data;
                    
                    if (error) {
                        res.status(500).send({
                            error: error, response: null
                        });
                    }
                    return res.status(200).send({
                        cep: data.cep,
                        estado: data.localidade,
                        cidade: data.uf,
                        bairro: data.bairro,
                        rua: data.logradouro,
                        ddd: data.ddd
                    });
                })
                .catch(e => {
                    console.log(e);
                });
            }
        );
    });
});

router.put('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE numeros SET numero = ? WHERE id = ?`,
            [req.body.numero, req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error, response: null
                    });
                }

                res.status(202).send({
                    mensagem: 'Cep Editado com sucesso!'
                });
            }
        );
    });
});

router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `DELETE FROM numeros WHERE id = ?`,
            [req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error, response: null
                    });
                }

                res.status(202).send({
                    mensagem: 'Cep excluido com sucesso!'
                });
            }
        );
    });
});

module.exports = router;