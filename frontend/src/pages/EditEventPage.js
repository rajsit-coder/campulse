import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditEventPage.css";
const EditEventPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({
        contact: "",
        organizer: "",
        title: "",
        description: "",
        club: "",
        tags: "",
        maxMember: "",
        minMember: "",
        date: "",
        time: "",
        endtime: "",
        room: "",
        contact: "",
        organizer: "",
        maxMembers: "",
        minMembers: "",
        startingTime: "",
        endingTime: "",
    });
    const [qrFile, setqrFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    useEffect(() => {
        fetch(`https://campulse.onrender.com/api/events/${eventId}`)
            .then((res) => res.json())
            .then((data) => {
                setEvent(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    club: data.club,
                    tags: data.tags,
                    date: data.date,
                    time: data.time,
                    endtime: data.endtime,
                    room: data.room,
                    contact: data.contact,
                    organizer: data.organizer,
                    maxMembers: data.maxMembers,
                    minMembers: data.minMembers,
                });
            })
            .catch((err) => console.error("Failed to load event:", err));
    }, [eventId]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedEvent = new FormData();

        Object.entries(formData).forEach(([key, val]) => {
            updatedEvent.append(key, val);
        });

        if (imageFile) updatedEvent.append("image", imageFile);
        if (pdfFile) updatedEvent.append("file", pdfFile);
        if (qrFile) updatedEvent.append("qr", qrFile);

        try {
            const res = await fetch(`https://campulse.onrender.com/api/events/edit/${eventId}`, {
                method: "PUT",
                body: updatedEvent,
            });

            if (res.ok) {
                alert("Event updated successfully!");
                navigate("/dashboard");
            } else {
                alert("Failed to update event");
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    if (!event) return <p>Loading event data...</p>;

    return (
        <div className="event-feed-container">
            <h1 className="feed-title">Edit Event</h1>
            <form onSubmit={handleSubmit} className="event-form">
                <label>Co-ordinator Name</label>
                <input
                    type="text"
                    name="organizer"
                    placeholder="Organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    required
                />
                <label>Co-ordinator Contact Number</label>
                <input
                    type="text"
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                />
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <label>Description</label>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <label>Club</label>
                <select name="club" value={formData.club} onChange={handleChange} required>
                    <option value="">Select Club</option>
                    <option value="Robotics Club">Robotics Club</option>
                    <option value="Cultural Club">Cultural Club</option>
                    <option value="Coding Club">Coding Club</option>
                </select>
                <label>Types</label>
                <select name="tags" value={formData.tags} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="Tech">Tech</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Workshop">Workshop</option>
                </select>

                <label>Minimum Number of Members</label>
                <input
                    type="text"
                    name="minMembers"
                    placeholder="Minimum Number of Members"
                    value={formData.minMembers}
                    onChange={handleChange}
                    required
                />

                <label>Maximum Number of Members</label>
                <input
                    type="text"
                    name="maxMembers"
                    placeholder="Maximum Number of Members"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    required
                />
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <label>Starting Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                <label>Ending Time</label>
                <input type="time" name="endtime" value={formData.endtime} onChange={handleChange} required />

                {/* Show current image */}
                {event.image && (
                    <div>
                        <p>Current Image:</p>
                        <img
                            src={`https://campulse.onrender.com/uploads/${event.image}`}
                            alt="event"
                            style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
                        />
                    </div>
                )}
                <label>Upload New Image:</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

                {event.qr && (
                    <div>
                        <p>QR code image:</p>
                        <img
                            src={`https://campulse.onrender.com/uploads/${event.qr}`}
                            alt="event"
                            style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
                        />
                    </div>
                )}
                <label>Upload New QR Image:</label>
                <input type="file" accept="image/*" onChange={(e) => setqrFile(e.target.files[0])} />

                {/* Show current PDF */}
                {event.file && (
                    <div>
                        <p>Current PDF: <button className="edit-pdf-button"><a className="view-old-pdf" href={`https://campulse.onrender.com/uploads/${event.file}`} target="_blank" rel="noreferrer">View PDF</a>
                        </button>
                        </p>
                    </div>
                )}
                <label>Upload New PDF:</label>
                <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditEventPage;
