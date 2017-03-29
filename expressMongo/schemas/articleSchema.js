var mongoose = require('mongoose');
var marked = require('marked');

var articleSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    pv: Number
});

articleSchema.statics = {
    addCreatedAt: function() {
        return this.add({ lastMod: Date })
    },
    afterFind: function(articles) {
        return articles.map(function(article) {
            article.content = marked(article.content);
            return article;
        });
    },
    afterFindOne: function(article) {
        if (article) {
            article.content = marked(article.content);
        }
        return article;
    }
}

module.exports = articleSchema;
