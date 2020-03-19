const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Habit = require('../models/habit');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {

    try {
        const habits = await Habit.find({ user: req.userId });

        const userOverallPercentage = setUserOverallPercentage(habits);

        return res.send({ habits, userOverallPercentage });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading habits' });
    }
});

router.post('/', async (req, res) => {

    const { name, reminderMessage, color } = req.body;

    try {

        const percentageHistory = generateNewPercentageHistory();

        const habit = await Habit.create({ name, reminderMessage, color, percentageHistory, user: req.userId });

        return res.send({ habit });

    } catch (err) {
        console.log(err);
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

function setUserOverallPercentage(habits) {
    var pe = habits.map(x => (x.currentPercentage));
    const userOverallPercentage = pe.reduce((a, b) => a + b, 0) / pe.length;
    return userOverallPercentage;
}

function generateNewPercentageHistory() { // generate 30 days percentage history
    var d1 = new Date();
    d1.setHours(18); d1.setMinutes(0); d1.setSeconds(0); d1.setMilliseconds(0);
    var milliSenconds = d1.getTime(); // today in milliseconds
    var historyArray = [];
    for (let index = 30; index > 0; index--) {
        var Obj = {
            date: new Date(milliSenconds - 86400000 * index), //  86.400.000 = 1 day in milliseconds
            percentage: 0,
            performed: false,
        }
        historyArray.push(Obj);
    }
    return historyArray;
}

module.exports = app => app.use('/habits', router);