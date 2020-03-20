const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    habitsOverallPercentage: {
        type: Number,
        minimum : 0,
        maximum : 100,
        default: 0,
        required: true,
    },
    profilePhoto: {
        name: String,
        size: Number,
        key: String,
        url: String,        
    }    
});

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;