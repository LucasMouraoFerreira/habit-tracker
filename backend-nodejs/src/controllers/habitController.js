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

        lookForChangesInPercentageHistory(habits);

        savePercentageHistoryChanges(habits);

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

        const habitsOverallPercentage = await FindHabitsSetUserOverallPercentageAndUpdate(req.userId);

        return res.send({ habit, habitsOverallPercentage });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error creating habit' });
    }
});

router.put('/:habitId', async (req, res) => {

    var objForUpdate = {};

    //prevent null values
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

        const habitsOverallPercentage = await FindHabitsSetUserOverallPercentageAndUpdate(req.userId);

        return res.send({ habitsOverallPercentage });

    } catch (err) {
        return res.status(400).send({ error: 'Error deleting habit' });
    }
});

router.post('/habitperformed/:habitId', async (req, res) => {

    try {
        const habit = await Habit.findById(req.params.habitId);

        // percentage history is supposed to have yesterday as the last day stored
        if (dateDiffInDays(habit.percentageHistory[29].date, new Date()) !== 1) 
            return res.status(400).send({ error: 'Unexpected Error' });

        performHabit(habit);

        await Habit.updateOne({ _id: habit._id }, habit);

        const habitsOverallPercentage = await FindHabitsSetUserOverallPercentageAndUpdate(req.userId);

        return res.send({ habit, habitsOverallPercentage });

    } catch (err) {
        return res.status(400).send({ error: 'Error performing habit' });
    }
});

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

async function FindHabitsSetUserOverallPercentageAndUpdate(userId) {
    const habits = await Habit.find({ user: userId });
    var habitsOverallPercentage;
    if (habits.length > 0) {
        habitsOverallPercentage = setUserOverallPercentage(habits);
        await User.updateOne({_id : userId}, { habitsOverallPercentage }, { new: true });
        return habitsOverallPercentage;
    }
    return 0;
}

function setUserOverallPercentage(habits) {
    if (habits.length > 0) {
        var pe = habits.map(x => (x.currentPercentage));
        const userOverallPercentage = pe.reduce((a, b) => a + b, 0) / pe.length;
        return userOverallPercentage;
    }
    return 0;
}

function savePercentageHistoryChanges(habits) {
    async.eachSeries(habits, function updateObject(element, done) {
        Habit.updateOne({ _id: element._id }, {
            consecutiveDaysNotPerforming: element.consecutiveDaysNotPerforming,
            consecutiveDaysPerforming: element.consecutiveDaysPerforming,
            percentageHistory: element.percentageHistory
        }, done);
    }, function allDone(err) {
    });
}

function lookForChangesInPercentageHistory(habits) {
    habits.forEach((element) => {
        verifyDaysPastSinceLastLogin(element);
    });
}

function verifyDaysPastSinceLastLogin(habit) {
    var d1 = new Date();
    var todayInMilliSenconds = d1.getTime();
    var diff = dateDiffInDays(habit.percentageHistory[29].date, d1);
    if (diff > 1) {
        habit.consecutiveDaysPerforming = 0;
        for (let index = 0; index < (diff - 1); index++) {
            habit.percentageHistory.shift();
            habit.consecutiveDaysNotPerforming++;
            var Obj = {
                date: new Date(todayInMilliSenconds - (_MS_PER_DAY * (diff - 1 - index))),
                percentage: calculateLoss(habit),
                performed: false,
            }
            habit.percentageHistory.push(Obj);
        }
    }
}

function calculateLoss(habit) {
    var daysNotP = habit.consecutiveDaysNotPerforming;
    var baseLossPercentage = (100 - (habit.maxConsecutiveDaysPerforming * 5)); //takes 20 days to build a powerful habit :3
    if (baseLossPercentage < 1) baseLossPercentage;
    var newPercentage = (habit.currentPercentage - (daysNotP * baseLossPercentage));
    if (newPercentage < 0) newPercentage = 0;

    return newPercentage;
}

function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function generateNewPercentageHistory() { // generate 30 days percentage history
    var d1 = new Date();
    var todayInMilliSenconds = d1.getTime();
    var percentageHistory = [];
    for (let index = 30; index > 0; index--) {
        var Obj = {
            date: new Date(todayInMilliSenconds - (_MS_PER_DAY * index)),
            percentage: 0,
            performed: false,
        }
        percentageHistory.push(Obj);
    }
    return percentageHistory;
}

function performHabit(habit) {
    habit.percentageHistory.shift();
    habit.consecutiveDaysNotPerforming = 0;
    var Obj = {
        date: new Date(),
        percentage: addPercentage(habit),
        performed: true,
    }
    habit.currentPercentage = Obj.percentage;
    habit.percentageHistory.push(Obj);
    habit.consecutiveDaysPerforming++;
    if (habit.consecutiveDaysPerforming > habit.maxConsecutiveDaysPerforming)
        habit.maxConsecutiveDaysPerforming = habit.consecutiveDaysPerforming;
}

function addPercentage(habit) {
    var percentage = habit.currentPercentage + 5;
    if (percentage > 100) percentage = 100;

    return percentage;
}

module.exports = app => app.use('/habits', router);