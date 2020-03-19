const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Habit = require('../models/habit');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {

    try {
        const habits = await Habit.find({ user: req.userId });

        return res.send(habits);
    } catch (err) {
        return res.status(400).send({ error: 'Error loading habits' });
    }
});

router.post('/', async (req, res) => {

    const { name, reminderMessage, color } = req.body;

    try {
        const habit = await Habit.create({ name, reminderMessage, color, user: req.userId });

        return res.send({ habit });

    } catch (err) {
        return res.status(400).send({ error: 'Error creating habit' });
    }

});

router.put('/:habitId', async (req, res) => {

    var objForUpdate = {};

    if (req.body.name) objForUpdate.name = req.body.name;
    if (req.body.reminderMessage) objForUpdate.reminderMessage = req.body.reminderMessage;
    if (req.body.color) objForUpdate.color = req.body.color;

    try {
        const habit = await Habit.findByIdAndUpdate(req.params.habitId, { $set: objForUpdate }, { new: true });

        return res.send({ habit });

    } catch (err) {
        return res.status(400).send({ error: 'Error updating habit' });
    }

});

router.delete('/:habitId', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.habitId);

        res.status(204).send();

    } catch (err) {
        return res.status(400).send({ error: 'Error deleting habit' });
    }
});

module.exports = app => app.use('/habits', router);