const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');


const UsserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UsserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UsserSchema);