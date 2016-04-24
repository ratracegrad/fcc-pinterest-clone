'use strict';

var mongoose = require('mongoose');

var pinSchema = new mongoose.Schema({
    title:      String,
    url:        String,
    username:   String
});

module.exports = mongoose.model('Pin', pinSchema);