const express = require('express');
const async = require('async');
const authMiddleware = require('../middlewares/auth')

const Habit = require('../models/habit');
const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {

    try {
        const habits = await Habit.find({ user: req.userId });

        habits.forEach((element) => {
            verifyDaysPastSinceLastLogin(element);
        });

        async.eachSeries(habits, function updateObject (element, done) {
            Habit.updateOne({ _id: element._id }, {
                consecutiveDaysNotPerforming: element.consecutiveDaysNotPerforming,
                consecutiveDaysPerforming: element.consecutiveDaysPerforming,
                percentageHistory: element.percentageHistory
            }, done);
        }, function allDone (er) {
        });
        
        const habitsOverallPercentage = setUserOverallPercentage(habits);

        await User.findByIdAndUpdate(req.userId, { habitsOverallPercentage });

        return res.send({ habits, habitsOverallPercentage });
    } catch (err) {
        console.log(err);
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

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function setUserOverallPercentage(habits) {
    var pe = habits.map(x => (x.currentPercentage));
    const userOverallPercentage = pe.reduce((a, b) => a + b, 0) / pe.length;
    return userOverallPercentage;
}

function lookForChangesInPercentageHistory(habits) {
    habits.array.forEach((element) => {
        verifyDaysPastSinceLastLogin(element);
    });
}

function verifyDaysPastSinceLastLogin(habit) {
    var d1 = new Date();
    var milliSenconds = d1.getTime();
    var diff = dateDiffInDays(habit.percentageHistory[29].date, d1);
    if (diff > 1) {
        habit.consecutiveDaysPerforming = 0;
        for (let index = 0; index < (diff - 1); index++) {
            habit.percentageHistory.shift();
            habit.consecutiveDaysNotPerforming++;
            var Obj = {
                date: new Date(milliSenconds - (_MS_PER_DAY * (diff - 1 - index))),
                percentage: calculateLoss(habit),
                performed: false,
            }
            habit.percentageHistory.push(Obj);
        }
    }
}

function generateNewPercentageHistory() { // generate 30 days percentage history
    var d1 = new Date();
    var milliSenconds = d1.getTime();
    var percentageHistory = [];
    for (let index = 30; index > 0; index--) {
        var Obj = {
            date: new Date(milliSenconds - (_MS_PER_DAY * index)),
            percentage: 50,
            performed: false,
        }
        percentageHistory.push(Obj);
    }
    return percentageHistory;
}

function calculateLoss(habit) {
    var daysNotP = habit.consecutiveDaysNotPerforming;

    var baseLossPercentage = (100 - (habit.maxConsecutiveDaysPerforming * 5));
    if (baseLossPercentage < 1) {
        baseLossPercentage = 1;
    }
    var newPercentage = (habit.currentPercentage - (daysNotP * baseLossPercentage));
    if (newPercentage < 0) {
        newPercentage = 0;
    }
    return newPercentage;
}

function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

module.exports = app => app.use('/habits', router);