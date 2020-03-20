const express = require('express');
const authMiddleware = require('../middlewares/auth')
const bcrypt = require('bcryptjs');
const multer = require('multer');

const multerConfig = require('../config/multer');
const User = require('../models/user');
const Habit = require('../models/habit');

const router = express.Router();

router.use(authMiddleware);


router.put('/', async (req, res) => {

    try {
        var objForUpdate = {};

        if (req.body.name) objForUpdate.name = req.body.name;
        if (req.body.password) {
            objForUpdate.password = req.body.password;
            const hash = await bcrypt.hash(objForUpdate.password, 12);
            objForUpdate.password = hash;
        }

        const user = await User.findByIdAndUpdate(req.userId, { $set: objForUpdate }, { new: true });

        user.password = undefined;

        return res.send({ user });

    } catch (err) {
        return res.status(400).send({ error: 'Error updating user' });
    }

});


router.delete('/', async (req, res) => {
    try {
        
        await Habit.deleteMany({user: req.userId}); // delete all habits associated with this user

        await User.findByIdAndDelete(req.userId);

        return res.status(204).send();

    } catch (err) {
        return res.status(400).send({ error: 'Error deleting user' });
    }
});

router.post('/profilephoto', multer(multerConfig).single('file') , async (req, res) => {

    const { originalname, size, filename } = req.file;

    const objForUpdate = {
        name: originalname,
        size,
        key: filename,
        url : `http://localhost:8080/images/${filename}`,
    };
    
    const user = await User.findByIdAndUpdate(req.userId, { profilePhoto : objForUpdate}, { new: true });

    user.password = undefined;
    
    return res.send(user);
});

module.exports = app => app.use('/users', router);