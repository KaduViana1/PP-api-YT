import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';

class UserRepository {
  create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    pool.getConnection((err: any, connection: any) => {
      hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json(err);
        }

        connection.query(
          'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
          [uuidv4(), name, email, hash],
          (error: any, result: any, fields: any) => {
            connection.release();
            if (error) {
              return res.status(400).json(error);
            }
            res.status(200).json({ message: 'User successfully created' });
          }
        );
      });
    });
  }

  login(req: Request, res: Response) {
    const { name, email, password } = req.body;
    pool.getConnection((err: any, connection: any) => {
      connection.query(
        'SELECT * FROM users  WHERE email = ?',
        [email],
        (error: any, results: any, fields: any) => {
          connection.release();
          if (error) {
            return res.status(400).json({ error: 'Autentication Error!' });
          }

          compare(password, results[0].password, (err, result) => {
            if (error) {
              return res.status(400).json({ error: 'Autentication Error!' });
            }
            if (result) {
              const token = sign(
                {
                  id: results[0].user_id,
                  email: results[0].email,
                },
                process.env.SECRET as string,
                { expiresIn: '1d' }
              );

              console.log(token);
              return res
                .status(200)
                .json({ token: token, message: 'Successfully Autenticated' });
            }
          });
        }
      );
    });
  }

  getUser(req: any, res: any) {
    const decode: any = verify(
      req.headers.authorization,
      process.env.SECRET as string
    );
    if (decode.email) {
      pool.getConnection((error, conn) => {
        conn.query(
          'SELECT * FROM users WHERE email=?',
          [decode.email],
          (error, result, fields) => {
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
          }
        );
      });
    }
  }
}

export { UserRepository };
