import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

class VideosRepository {
  create(req: Request, res: Response) {
    const date = new Date().toISOString().substring(0, 19).split('T').join(' ');
    const { user_id, title, card_image, description } = req.body;
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'INSERT INTO videos (video_id, user_id, title, card_image, views, upload_date, description) VALUES (?,?,?,?,?,?,?)',
        [uuidv4(), user_id, title, card_image, 0, date, description],
        (error: any, result: any, fields: any) => {
          connection.release();
          if (error) {
            return res.status(400).json(error);
          }
          res.status(200).json({ message: 'Video successfully created' });
        }
      );
    });
  }

  getVideos(req: Request, res: Response) {
    const { user_id } = req.body;
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'SELECT * FROM videos WHERE user_id = ?',
        [user_id],
        (error: any, results: any, fields: any) => {
          connection.release();
          if (error) {
            return res.status(400).json({ error: 'Error in video search' });
          }
          return res
            .status(200)
            .json({ message: 'Videos Successfully Returned', videos: results });
        }
      );
    });
  }

  searchVideos(req: Request, res: Response) {
    const { search } = req.query;
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'SELECT * FROM videos WHERE title LIKE ?',
        [`%${search}%`],
        (error: any, results: any, fields: any) => {
          connection.release();
          if (error) {
            return res.status(400).json({ error: 'Error in video search' });
          }
          return res
            .status(200)
            .json({ message: 'Videos Successfully Returned', videos: results });
        }
      );
    });
  }
}

export { VideosRepository };
