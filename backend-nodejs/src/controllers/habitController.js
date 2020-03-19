const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Habit = require('../models/habit');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    res.send({ user: req.userId });
});

router.post('/', async (req, res) => {
    res.send({ user: req.userId })
});

router.put('/:habitId', async (req, res) => {
    res.send({ user: req.userId });
});

router.delete('/:habitId', async (req, res) => {
    res.send({ user: req.userId });
});

module.exports = app => app.use('/habits', router);