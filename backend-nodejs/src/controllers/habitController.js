const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Habit = require('../models/habit');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {

    try {
        const habits = await Habit.find({user: req.userId});

        return res.send(habits);
    } catch (err) {
        return res.status(400).send({ error: 'Error loading habits' });
    }
});

router.post('/', async (req, res) => {

    try {
        const habit = await Habit.create({...req.body, user: req.userId});

        return res.send({ habit });

    } catch (err) {
        return res.status(400).send({ error: 'Error creating habit'});
    }
  
});

router.put('/:habitId', async (req, res) => {
    res.send({ user: req.userId });
});

router.delete('/:habitId', async (req, res) => {
    res.send({ user: req.userId });
});

module.exports = app => app.use('/habits', router);