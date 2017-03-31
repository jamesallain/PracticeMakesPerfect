var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myblog');

var lastMod=  function(schema, options) {
  schema.add({ lastMod: Date })
  
  schema.pre('save', function (next) {
    this.lastMod = new Date
    next()
  })
  
  if (options && options.index) {
    schema.path('lastMod').index(options.index)
  }
}
var Schema = mongoose.Schema
var Game = new Schema({name: String});
Game.plugin(lastMod, { index: true });
var games = mongoose.model('games', Game);
var game = new games({ name: "game" });

game.save(function(err,game){

 console.log("game")
});

games.find({ name: "game" },function(err,kittens){
 console.log(kittens)
})
