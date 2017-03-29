exports.userSchema = new mongoose.Schema({
    name: String,
    password: String,
    avatar: String,
    gender: { type: String, enum: ['m', 'f', 'x'] },
    bio: { type: String }
});

exports.addCreatedAt = function(schema) {
    schema.add({ lastMod: Date })
    schema.pre('findOne', function(next) {
        this.lastMod = new Date;
        next()
    })
}
exports.userSchema.plugin(exports.addCreatedAt);

exports.articleSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    pv: Number
});
