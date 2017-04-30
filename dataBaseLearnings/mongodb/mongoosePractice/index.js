var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myblog');
var db = mongoose.connection;

db.on('open', function() {
    console.log('connect open')
});

var kittySchema = mongoose.Schema({
    name: String
}, { timestamps: { createdAt: 'created_at' } });

kittySchema.methods = {
    speakMethod: function() {
        var greeting = this.name ? "Meow name is " + this.name : "I don't have a name"
        console.log(greeting);
        // var modelName = this.model("Kitten")
        // console.log(modelName)
    }
}
kittySchema.statics = {
    speakStatic: function() {
        var greeting = this.name ? "Meow name is " + this.name : "I don't have a name"
        console.log(greeting);
    }
}

var kitten = mongoose.model('Kitten', kittySchema);
var silence = new kitten({ name: "silence" });

silence.save(function(err,silence){
 silence.speakMethod();
 kitten.speakStatic();
 console.log("save")
});
kitten.find({ name: "silence" },function(err,kittens){
 console.log(kittens)
})
kitten.find({ name: "silence" }).exec(function(err, result) {
    console.log(result)
})
