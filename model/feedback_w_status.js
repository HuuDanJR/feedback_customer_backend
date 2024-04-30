var mongoose = require('mongoose');
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const { ObjectId } = mongoose.Types;

const FeedBackSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String,
    },
    driver:{
        required:true,type:String
    },
    
    star: {
        required: true,
        type: Number,
    },
    //content:'i so happy when i had that ride'
    content: {
        required: true,
        type: String,
    },
    //experience:[good,friendly,ok,happy]
    experience:{
        required:true,
        type: [String],
        // type:String,
    },
    //check if else the process is true or false
    isprocess: {
        required: true,
        type: Boolean,
        default: false,
    },

    //procress time
    processcreateAt:{
        required:true,
        type:Date
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
})

const FeedBacks = db.db1.model("feedback2s", FeedBackSchema);
module.exports = FeedBacks;
