var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    name: String,
    purpose: String,
    logo: String,
    backgroundImage: String,
    colorOne: String,
    colorTwo: String,
    colorThree: String,
    template: String,
    body: String
});

module.exports = mongoose.model("Project", projectSchema);