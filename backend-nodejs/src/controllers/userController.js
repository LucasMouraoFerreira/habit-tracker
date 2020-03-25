const express = require('express');
const authMiddleware = require('../middlewares/auth')
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const multerConfig = require('../config/multer');
const User = require('../models/user');
const Habit = require('../models/habit');

const router = express.Router();

router.use(authMiddleware);

router.put('/', async (req, res) => {

    try {
        var objForUpdate = {};
        
        if (req.body.password) {
            objForUpdate.password = req.body.password;
            const hash = await bcrypt.hash(objForUpdate.password, 12);
            objForUpdate.password = hash;
        }

        const user = await User.findByIdAndUpdate(req.userId, { $set: objForUpdate }, { new: true });

        user.password = undefined;

        return res.send({user});

    } catch (err) {
        return res.status(400).send({ error: 'Error updating user' });
    }

});


router.delete('/', async (req, res) => {
    try {

        await Habit.deleteMany({ user: req.userId }); // delete all habits associated with this user

        const photoKey = await User.findById(req.userId);

        if (photoKey.profilePhoto.key)
            promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', photoKey.profilePhoto.key));

        await User.findByIdAndDelete(req.userId);

        return res.status(204).send();

    } catch (err) {
        return res.status(400).send({ error: 'Error deleting user' });
    }
});

router.put('/profilephoto', multer(multerConfig).single('file'), async (req, res) => {

    try {
        
        const { originalname, size, filename } = req.file;

        const objForUpdate = {
            name: originalname,
            size,
            key: filename,
            url: `http://localhost:8080/images/${filename}`,
        };

        const photoKey = await User.findById(req.userId);

        if (photoKey.profilePhoto.key && photoKey.profilePhoto.key !== 'default-user')
            promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', photoKey.profilePhoto.key));

        const user = await User.findByIdAndUpdate(req.userId, { profilePhoto: objForUpdate }, { new: true });

        user.password = undefined;

        return res.send({user});
    } catch (err) {
        return res.status(400).send({ error: 'Error uploading profile photo' });
    }
});

router.delete('/profilephoto', async (req, res) => {

    try {        
        const photoKey = await User.findById(req.userId);

        if (!photoKey.profilePhoto.key || photoKey.profilePhoto.key === 'default-user')
            return res.status(400).send({ error: 'Profile photo not found' });

        const objForUpdate = {
            name: "default-user",
            size: "0",
            key: "default-user",
            url: "http://localhost:8080/images/default-user.png",
        };

        const user = await User.findByIdAndUpdate(req.userId, { profilePhoto: objForUpdate }, { new: true });

        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', photoKey.profilePhoto.key));

        user.password = undefined;

        return res.send({user});
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting profile photo' });
    }
});


module.exports = app => app.use('/users', router);