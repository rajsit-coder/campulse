import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostEvent.css";

const PostEventPage = () => {
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState({
        userId: "",
        title: "",
        description: "",
        club: "",
        tags: "",
        date: "",
        time: "",
        endtime: "",
        room: "",
        qr: null,
        image: null,
        pollType: "",
        pollOptions: [],
        file: null,
        contact: "",
        organizer: "",
        maxMembers: 6,
        minMembers: 1,
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setEventDetails((prev) => ({
                ...prev,
                userId: user._id,
            }));
        }
    }, []);


    const [mcqOptions, setMcqOptions] = useState(["", ""]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEventDetails((prev) => ({
            ...prev,
            image: file || null,
        }));
    };

    const handleQrChange = (e) => {
        const file = e.target.files[0];
        setEventDetails((prev) => ({
            ...prev,
            qr: file || null,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setEventDetails((prev) => ({
            ...prev,
            file: file || null,
        }));
    };

    const handlePollTypeChange = (e) => {
        const pollType = e.target.value;
        setEventDetails((prev) => ({
            ...prev,
            pollType,
            pollOptions: pollType === "yesno" ? ["Yes", "No"] : [],
        }));
        if (pollType === "mcq") {
            setMcqOptions(["", ""]);
        }
    };

    // const handleMcqOptionChange = (index, value) => {
    //   const updatedOptions = [...mcqOptions];
    //   updatedOptions[index] = value;
    //   setMcqOptions(updatedOptions);
    //   setEventDetails((prev) => ({
    //     ...prev,
    //     pollOptions: updatedOptions,
    //   }));
    // };


    // const addMcqOption = () => {
    //   if (mcqOptions.length < 5) {
    //     const updated = [...mcqOptions, ""];
    //     setMcqOptions(updated);
    //   }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate minMembers and maxMembers
        if (eventDetails.minMembers > eventDetails.maxMembers) {
            alert("❌ Minimum number of members cannot be greater than maximum.");
            return;
        }

        const formData = new FormData();
        Object.entries(eventDetails).forEach(([key, value]) => {
            if (key === "pollOptions") {
                formData.append(key, JSON.stringify(value));
            } else if (key === "minMembers" || key === "maxMembers") {
                formData.append(key, parseInt(value)); // Ensure min/max are numbers
            } else if (value || value === 0) {
                formData.append(key, value);
            }
        });

        try {
            const response = await fetch("https://campulse.onrender.com/api/events/post", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Event created successfully!");
                navigate("/home");
            } else {
                alert("❌ Error: " + (result?.message || "Something went wrong"));
            }
        } catch (error) {
            alert("❌ Error: " + error.message);
        }
    };

    const handleCancel = () => {
        navigate("/home");
    };

    // Update maxMembers range based on minMembers
    const handleMinMembersChange = (e) => {
        const min = parseInt(e.target.value, 10);
        const max = min > eventDetails.maxMembers ? min : eventDetails.maxMembers;
        setEventDetails((prev) => ({
            ...prev,
            minMembers: min,
            maxMembers: max,
        }));
    };

    const handleMaxMembersChange = (e) => {
        const max = parseInt(e.target.value, 10);
        if (max < eventDetails.minMembers) {
            alert("❌ Maximum number of members cannot be less than minimum.");
            return;
        }
        setEventDetails((prev) => ({
            ...prev,
            maxMembers: max,
        }));
    };

    return (
        <div style={{ padding: '30px' }}>
            <div className="post-event-container">
                <h2>Create New Event</h2>
                <form
                    onSubmit={handleSubmit}
                    className="event-form-pe"
                    encType="multipart/form-data"
                >
                    <div className="form-group">
                        <label>Co-ordinator Name:</label>
                        <input
                            type="text"
                            name="organizer"
                            value={eventDetails.organizer}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Co-ordinator's Contact Number:</label>
                        <input
                            className="tel"
                            type="tel"
                            name="contact"
                            value={eventDetails.contact}
                            onChange={handleInputChange}
                            pattern="[0-9]{10}"
                            title="Enter a 10-digit phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={eventDetails.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={eventDetails.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Club:</label>
                        <select
                            className="club-select"
                            name="club"
                            value={eventDetails.club}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Club</option>
                            <option value="Robotics Club">Robotics Club</option>
                            <option value="Cultural Club">Cultural Club</option>
                            <option value="Coding Club">Coding Club</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Types:</label>
                        <select
                            className="club-select"
                            name="tags"
                            value={eventDetails.tags}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Tech">Tech</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Minimum Number of Members:</label>
                            <input
                                className="number-member"
                                type="number"
                                name="minMembers"
                                value={eventDetails.minMembers}
                                onChange={handleMinMembersChange}
                                min="1"
                                max="6"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="min-Max-member">Maximum Number of Members:</label>
                            <input
                                className="number-member"
                                type="number"
                                name="maxMembers"
                                value={eventDetails.maxMembers}
                                onChange={handleMaxMembersChange}
                                min={eventDetails.minMembers}
                                max="6"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date:</label>
                            <input
                                className="date-select"
                                type="date"
                                name="date"
                                value={eventDetails.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Room Number:-</label>
                            <input
                                type="text"
                                name="room"
                                value={eventDetails.room}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>


                    <div className="form-row">
                        <div className="form-group">
                            <label> Starting Time:-</label>
                            <input
                                className="time-select"
                                type="time"
                                name="time"
                                value={eventDetails.time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ending Time:-</label>
                            <input
                                className="time-select"
                                type="time"
                                name="endtime"
                                value={eventDetails.endtime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Event Image:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload QR code:</label>
                        <input
                            type="file"
                            name="qr"
                            onChange={handleQrChange}
                            accept="image/*"
                        />
                    </div>

                    <div className="form-group">
                        <label>Poll Type (Optional):</label>
                        <select
                            className="PollType-select"
                            name="pollType"
                            value={eventDetails.pollType}
                            onChange={handlePollTypeChange}
                        >
                            <option value="">None</option>
                            <option value="yesno">Yes/No</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>File Attachment (Optional):</label>
                        <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostEventPage;
