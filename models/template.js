var mongoose = require("mongoose");

var templateSchema = new mongoose.Schema({
    name: String,
    description: String,
    previewImage: String,
    body: String,
    inputs: String,
    themePurchaseLink: String
});

module.exports = mongoose.model("Template", templateSchema);

