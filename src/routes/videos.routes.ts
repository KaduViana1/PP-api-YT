import { Router } from 'express';
import { VideosRepository } from '../modules/videos/repositories/VideosRepositories';
import { login } from '../middlewares/login';

const videosRoutes = Router();
const videosRepository = new VideosRepository();

videosRoutes.post('/create-video', login, (req, res) => {
  videosRepository.create(req, res);
});

videosRoutes.get('/get-videos', (req, res) => {
  videosRepository.getVideos(req, res);
});

videosRoutes.get('/search', (req, res) => {
  videosRepository.searchVideos(req, res);
});

export { videosRoutes };
