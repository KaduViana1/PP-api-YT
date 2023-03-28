import { Router } from 'express';
import { login } from '../middlewares/login';
import { UserRepository } from '../modules/user/repositories/UserRepositories';

const userRoutes = Router();
const userRepository = new UserRepository();

userRoutes.post('/sign-up', (req, res) => {
  userRepository.create(req, res);
});

userRoutes.post('/log-in', (req, res) => {
  userRepository.login(req, res);
});

userRoutes.get('/get-user', login, (req, res) => {
  userRepository.getUser(req, res);
});

export { userRoutes };
