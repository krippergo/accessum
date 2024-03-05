const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/accessum');

const Checkpoint = require('./schemas/checkpointSchema')(mongoose);
const Point = require('./schemas/pointSchema')(mongoose);
const Account = require('./schemas/accountSchema')(mongoose);
const Session = require('./schemas/sessionSchema')(mongoose);

module.exports = { Account, Session, Point, Checkpoint };