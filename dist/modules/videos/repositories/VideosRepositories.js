"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideosRepository {
    create(req, res) {
        const date = new Date().toISOString().substring(0, 19).split('T').join(' ');
        const { user_id, title, card_image, description } = req.body;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('INSERT INTO videos (video_id, user_id, title, card_image, views, upload_date, description) VALUES (?,?,?,?,?,?,?)', [(0, uuid_1.v4)(), user_id, title, card_image, 0, date, description], (error, result, fields) => {
                connection.release();
                if (error) {
                    return res.status(400).json(error);
                }
                res.status(200).json({ message: 'Video successfully created' });
            });
        });
    }
    getVideos(req, res) {
        const { user_id } = req.body;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM videos WHERE user_id = ?', [user_id], (error, results, fields) => {
                connection.release();
                if (error) {
                    return res.status(400).json({ error: 'Error in video search' });
                }
                return res
                    .status(200)
                    .json({ message: 'Videos Successfully Returned', videos: results });
            });
        });
    }
    searchVideos(req, res) {
        const { search } = req.query;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM videos WHERE title LIKE ?', [`%${search}%`], (error, results, fields) => {
                connection.release();
                if (error) {
                    return res.status(400).json({ error: 'Error in video search' });
                }
                return res
                    .status(200)
                    .json({ message: 'Videos Successfully Returned', videos: results });
            });
        });
    }
}
exports.VideosRepository = VideosRepository;
