'use strict';

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    twitterID:          String,
    token:              String,
    username:           String,
    displayName:        String
});

module.exports = mongoose.model('User', userSchema);