import express from 'express';
import { config } from 'dotenv';
import { userRoutes } from './routes/user.routes';
import { videosRoutes } from './routes/videos.routes';

config();
const app = express();

const cors = require('cors');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳');
});

app.use(cors());

app.use(express.json());
app.use('/user', userRoutes);
app.use('/videos', videosRoutes);
app.listen(process.env.PORT);
