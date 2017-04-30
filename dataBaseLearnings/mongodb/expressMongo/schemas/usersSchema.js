var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
    name: String,
    password: String,
    avatar: String,
    gender: { type: String, enum: ['m', 'f', 'x'] },
    bio: { type: String }
});

usersSchema.pre('findOne', function(next) {
    this.lastMod = new Date;
    next()
});

usersSchema.statics ={
	addCreatedAt: function(){
		return this.add({ lastMod: Date })
	}
}

module.exports = usersSchema;
