const mongoose = require('../database');

const HabitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    reminderMessage: {
        type: String,
        required: true,
        default: 'Time to practice your habit!',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    currentPercentage: {
        type: Number,
        minimum: 0,
        maximum: 100,
        default: 0,
        required: true,
    },
    color: {
        type: String,
        required: true,
        default: '#009688'
    },
    percentageHistory: [{
        date: {
            type: Date,
            required: true,            
        },
        percentage: {
            type: Number,
            minimum: 0,
            maximum: 100,
            default: 0,
            required: true,
        },
        performed: {
            type: Boolean,
            required: true,
            default: false,
        }
    }],
});

const Habit = mongoose.model('Habit', HabitSchema);

module.exports = Habit;