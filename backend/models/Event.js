const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    timestamp: { type: Date, default: Date.now },
});

const pollAnswerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answer: String, // "Yes" or "No"
});
const memberSchema = new mongoose.Schema({
    name: String,
    regNo: String,
    contact: String,
});

const registrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teamName: String,
    teamLeader: String,
    numberOfMembers: Number,
    utrNumber: String,
    paymentScreenshot: String, // filename
    memberDetails: [memberSchema],
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    club: String,
    tags: [String],
    date: String,
    time: String,
    endtime: String,
    room: String,
    qr: String,
    image: String,
    file: String,
    contact: String,
    organizer: String,
    pollType: String, // e.g., "yesno"
    maxMembers: { type: Number, required: true }, // New field for max members
    minMembers: { type: Number, required: true },
    pollOptions: [String], // e.g., ["Yes", "No"]
    pollAnswers: [pollAnswerSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    interested: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    registrations: [registrationSchema],

});

module.exports = mongoose.model("Event", eventSchema);