"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoutes = void 0;
const express_1 = require("express");
const VideosRepositories_1 = require("../modules/videos/repositories/VideosRepositories");
const login_1 = require("../middlewares/login");
const videosRoutes = (0, express_1.Router)();
exports.videosRoutes = videosRoutes;
const videosRepository = new VideosRepositories_1.VideosRepository();
videosRoutes.post('/create-video', login_1.login, (req, res) => {
    videosRepository.create(req, res);
});
videosRoutes.get('/get-videos', (req, res) => {
    videosRepository.getVideos(req, res);
});
videosRoutes.get('/search', (req, res) => {
    videosRepository.searchVideos(req, res);
});
