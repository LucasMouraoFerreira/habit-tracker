const mongoose = require('mongoose',);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/habit-tracker');
mongoose.Promise = global.Promise;

module.exports = mongoose;