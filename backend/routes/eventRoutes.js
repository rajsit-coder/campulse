const express = require("express");
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");

const router = express.Router();

// File storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (_, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });
// GET /api/events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find(); // Import your Event model
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// Post Event
router.post("/post", upload.fields([{ name: "image" }, { name: "file" }, { name: "qr" }]), async (req, res) => {
    try {
        const {
            userId,
            title,
            description,
            club,
            tags,
            date,
            time,
            endtime,
            room,
            pollType,
            pollOptions,
            contact,
            organizer,
            maxMembers,
            minMembers,
        } = req.body;

        const newEvent = new Event({
            userId,
            title,
            description,
            club,
            tags,
            date,
            time,
            endtime,
            room,
            contact,
            organizer,
            image: req.files?.image?.[0]?.filename || "",
            file: req.files?.file?.[0]?.filename || "",
            qr: req.files?.qr?.[0]?.filename || "",
            pollType,
            pollOptions: pollOptions ? JSON.parse(pollOptions) : [],
            minMembers,
            maxMembers
        });

        await newEvent.save();
        res.status(200).json({ message: "Event created successfully!" });
    } catch (error) {
        console.error("Error saving event:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Get all events
router.get("/all", async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (error) {
        console.error("Failed to fetch events:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/events/:eventId
router.delete("/:eventId", async (req, res) => {
    const { eventId } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// router.get("/:eventId", async (req, res) => {
//     const { eventId } = req.params;

//     try {
//         // Fetch event and populate comments with user data (name, id)
//         const event = await Event.findById(eventId)
//             .populate("comments.userId", "name id")  // Populate userId in comments with name and id
//             .exec();

//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         // Send event data back in response
//         res.status(200).json(event);
//     } catch (error) {
//         console.error("Error fetching event:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// Like Toggle
router.put("/:id/like", async (req, res) => {
    const { userId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const index = event.likes.indexOf(userId);
        if (index === -1) {
            event.likes.push(userId);
        } else {
            event.likes.splice(index, 1);
        }

        await event.save();
        res.json({ likes: event.likes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Interested Toggle
router.put("/:id/interested", async (req, res) => {
    const { userId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const index = event.interested.indexOf(userId);
        if (index === -1) {
            event.interested.push(userId);
        } else {
            event.interested.splice(index, 1);
        }

        await event.save();
        res.json({ interested: event.interested });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Toggle Like
router.post("/:eventId/like", async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        const index = event.likes.indexOf(userId);

        if (index === -1) {
            event.likes.push(userId); // add like
        } else {
            event.likes.splice(index, 1); // remove like
        }

        await event.save();
        res.status(200).json({ likes: event.likes });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Toggle Interested
router.post("/:eventId/interested", async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        const index = event.interested.indexOf(userId);

        if (index === -1) {
            event.interested.push(userId); // add interested
        } else {
            event.interested.splice(index, 1); // remove interested
        }

        await event.save();
        res.status(200).json({ interested: event.interested });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


router.post("/:eventId/comment", async (req, res) => {
    const { userId, text } = req.body;
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const comment = {
            userId,
            text,
            timestamp: new Date(),
        };

        event.comments.push(comment);
        await event.save();
        res.json({ message: "Comment added" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit comment
router.put("/:eventId/comment/:commentId", async (req, res) => {
    const { userId, text } = req.body;
    try {
        const event = await Event.findById(req.params.eventId);
        const comment = event.comments.id(req.params.commentId);

        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }

        comment.text = text;
        comment.timestamp = new Date();

        await event.save();
        res.json({ message: "Comment updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete("/:eventId/comment/:commentId", async (req, res) => {
    const { eventId, commentId } = req.params;
    const { userId } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const comment = event.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Ensure the user is the comment owner
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Use .pull() to remove subdocument
        event.comments.pull(commentId);
        await event.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/:eventId/poll", async (req, res) => {
    const { eventId } = req.params;
    const { userId, answer } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const existingVoteIndex = event.pollAnswers.findIndex(
            (a) => a.userId.toString() === userId
        );

        if (existingVoteIndex !== -1) {
            event.pollAnswers[existingVoteIndex].answer = answer;
        } else {
            event.pollAnswers.push({ userId, answer });
        }

        await event.save();
        res.status(200).json({ message: "Poll answer submitted" });
    } catch (err) {
        console.error("Error submitting poll answer:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId)
            .populate("comments.userId", "name _id")
            .populate("pollAnswers.userId", "_id");

        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get('/user-data/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const events = await Event.find().lean();

        const createdEvents = events.filter(e => e.organizer === userId);

        const interestedEvents = events.filter(e =>
            Array.isArray(e.interested) &&
            e.interested.some(id => id?.toString?.() === userId)
        );

        const likedEvents = events.filter(e =>
            Array.isArray(e.likes) &&
            e.likes.some(id => id?.toString?.() === userId)
        );

        const comments = [];
        const pollAnswers = [];

        events.forEach(e => {
            if (Array.isArray(e.comments)) {
                e.comments.forEach(c => {
                    if (c?.userId?.toString?.() === userId) {
                        comments.push({
                            eventId: e._id,
                            eventTitle: e.title,
                            text: c.text,
                            timestamp: c.timestamp
                        });
                    }
                });
            }

            if (Array.isArray(e.pollAnswers)) {
                e.pollAnswers.forEach(p => {
                    if (p?.userId?.toString?.() === userId) {
                        pollAnswers.push({
                            eventId: e._id,
                            eventTitle: e.title,
                            answer: p.answer,
                            timestamp: p.timestamp || new Date()
                        });
                    }
                });
            }
        });

        res.json({
            createdEvents,
            interestedEvents,
            likedEvents,
            comments,
            pollAnswers
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user data." });
    }
});


router.put('/edit/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'qr', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), async (req, res) => {
    try {
        const eventId = req.params.id;

        const updateData = {
            title: req.body.title,
            description: req.body.description,
            club: req.body.club,
            tags: req.body.tags,
            date: req.body.date,
            time: req.body.time,
            contact: req.body.contact,
            organizer: req.body.organizer,
            maxMembers: req.body.maxMembers,
            minMembers: req.body.minMembers,
            endtime: req.body.endtime,
            room: req.body.room,
        };

        if (req.files['image']) {
            updateData.image = req.files['image'][0].filename;
        }
        if (req.files['file']) {
            updateData.file = req.files['file'][0].filename;
        }
        if (req.files['qr']) {
            updateData.file = req.files['qr'][0].filename;
        }
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post("/register/:eventId", upload.single("paymentScreenshot"), async (req, res) => {
    try {
        const {
            teamName,
            teamLeader,
            memberCount,
            utrNumber,
            memberDetails,
            userId,
        } = req.body;

        // Validate JSON
        let parsedMembers;
        try {
            parsedMembers = JSON.parse(memberDetails);
        } catch (err) {
            return res.status(400).json({ message: "Invalid memberDetails format" });
        }

        if (!Array.isArray(parsedMembers)) {
            return res.status(400).json({ message: "Invalid memberDetails format" });
        }

        const newRegistration = {
            teamName,
            teamLeader,
            memberCount: parseInt(memberCount),
            utrNumber,
            memberDetails: parsedMembers,
            paymentScreenshot: req.file ? req.file.filename : null,
            registeredAt: new Date(),
            userId,
        };

        // Push registration into the event's registrations array
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        event.registrations.push(newRegistration);
        await event.save();

        res.status(200).json({ message: "Registration successful", registration: newRegistration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.delete("/register/:eventId/:registrationId", async (req, res) => {
    const { eventId, registrationId } = req.params;

    try {
        // Find the event by ID
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Filter out the registration to be deleted
        event.registrations = event.registrations.filter(
            (registration) => registration._id.toString() !== registrationId
        );

        // Save the updated event
        await event.save();

        res.status(200).json({ message: "Registration deleted successfully" });
    } catch (error) {
        console.error("Error deleting registration:", error);
        res.status(500).json({ message: "Error deleting registration" });
    }
});

// GET route to get the event details along with registrations
router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;

    try {
        // Find the event by ID and populate the registrations array
        const event = await Event.findById(eventId).populate("registrations");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event details:", error);
        res.status(500).json({ message: "Error fetching event details" });
    }
});

// Example endpoint to check if the user is already registered for the event
router.get("/:eventId/check-registration", async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user._id; // Assuming you're using authentication middleware

    try {
        const registration = await Registration.findOne({ eventId, "memberDetails.userId": userId });

        if (registration) {
            return res.status(200).json({ registered: true });
        }

        return res.status(200).json({ registered: false });
    } catch (error) {
        console.error("Error checking registration:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/:eventId/responses', async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId)
            .populate('likes', 'name email')
            .populate('interested', 'name email')
            .populate('pollAnswers.userId', 'name email') // ✅ fixed
            .populate('comments.userId', 'name email');

        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json({
            likes: event.likes || [],
            interested: event.interested || [],
            pollResponses: event.pollAnswers || [], // ✅ fixed
            comments: event.comments || [],
        });
    } catch (err) {
        console.error("Error fetching responses:", err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

module.exports = router;
