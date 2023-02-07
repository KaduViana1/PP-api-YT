import { Router } from 'express';
import { UserRepository } from '../modules/user/repositories/UserRepositories';

const userRoutes = Router();
const userRepository = new UserRepository();

userRoutes.post('/sign-up', (req, res) => {
  userRepository.create(req, res);
});

userRoutes.post('/log-in', (req, res) => {
  userRepository.login(req, res);
});

export { userRoutes };
