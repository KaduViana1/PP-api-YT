"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(req, res) {
        const { name, email, password } = req.body;
        mysql_1.pool.getConnection((err, connection) => {
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json(err);
                }
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), name, email, hash], (error, result, fields) => {
                    connection.release();
                    if (error) {
                        return res.status(400).json(error);
                    }
                    res.status(200).json({ message: 'User successfully created' });
                });
            });
        });
    }
    login(req, res) {
        const { name, email, password } = req.body;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM users  WHERE email = ?', [email], (error, results, fields) => {
                connection.release();
                if (error) {
                    return res.status(400).json({ error: 'Autentication Error!' });
                }
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    if (err) {
                        return res.status(400).json({ error: 'Autentication Error!' });
                    }
                    if (result) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email,
                        }, process.env.SECRET, { expiresIn: '30d' });
                        return res
                            .status(200)
                            .json({ token: token, message: 'Successfully Autenticated' });
                    }
                });
            });
        });
    }
    getUser(req, res) {
        const decode = (0, jsonwebtoken_1.verify)(req.headers.authorization, process.env.SECRET);
        if (decode.email) {
            mysql_1.pool.getConnection((error, conn) => {
                conn.query('SELECT * FROM users WHERE email=?', [decode.email], (error, result, fields) => {
                    conn.release();
                    if (error) {
                        return res.status(400).send({
                            error: error,
                            res: null,
                        });
                    }
                    return res.status(201).send({
                        user: {
                            name: result[0].name,
                            email: result[0].email,
                            id: result[0].user_id,
                        },
                    });
                });
            });
        }
    }
}
exports.UserRepository = UserRepository;
