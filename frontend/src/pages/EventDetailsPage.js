import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/EventDetailsPage.css";
import "../styles/EventDetails.css";
import EventRegistrationModal from "./EventRegistrationModal";

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [interestedCount, setInterestedCount] = useState(0);
    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [pollAnswer, setPollAnswer] = useState("");
    const [isRegistered, setIsRegistered] = useState(false); // Track registration status
    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        fetchEvent();
    }, [eventId]);
    const convertTo12Hour = (time24) => {
        if (!time24 || typeof time24 !== "string" || !time24.includes(":")) {
            return "Invalid time";
        }

        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const fetchEvent = async () => {
        try {
            const res = await fetch(`https://campulse.onrender.com/api/events/${eventId}`);
            const data = await res.json();
            setEvent(data);
            setLiked(data.likes?.includes(user._id));
            setInterestedCount(data.interested?.length || 0);
            const existingPoll = data.pollAnswers?.find(a => a.userId === user._id);
            setPollAnswer(existingPoll?.answer || "");
            setLoading(false);

            // Check if user is already registered
            const userRegistration = data.registrations?.find(reg => reg.userId === user._id);
            setIsRegistered(!!userRegistration);
        } catch (error) {
            console.error("Error fetching event:", error);
            setLoading(false);
        }
    };

    const handleLike = async () => {
        setLiked(!liked); // optimistic toggle
        await fetch(`https://campulse.onrender.com/api/events/${eventId}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id }),
        });
        fetchEvent(); // or update state manually
    };


    const handleInterested = async () => {
        await fetch(`https://campulse.onrender.com/api/events/${eventId}/interested`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id }),
        });
        fetchEvent();
    };

    const handleCommentSubmit = async () => {
        if (comment.trim()) {
            await fetch(`https://campulse.onrender.com/api/events/${eventId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, text: comment }),
            });
            setComment("");
            fetchEvent();
        }
    };

    const handleCommentEdit = (commentId, text) => {
        setEditingCommentId(commentId);
        setEditedText(text);
    };

    const submitEditedComment = async (commentId) => {
        await fetch(`https://campulse.onrender.com/api/events/${eventId}/comment/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id, text: editedText }),
        });
        setEditingCommentId(null);
        setEditedText("");
        fetchEvent();
    };

    const deleteComment = async (commentId) => {
        await fetch(`https://campulse.onrender.com/api/events/${eventId}/comment/${commentId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id }),
        });

        fetchEvent();
    };

    const handlePollSelect = async (selectedAnswer) => {
        setPollAnswer(selectedAnswer);
        await fetch(`https://campulse.onrender.com/api/events/${eventId}/poll`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id, answer: selectedAnswer }),
        });
        fetchEvent();
    };

    if (loading) return <p>Loading...</p>;
    if (!event) return <p>Event not found.</p>;

    const {
        title,
        description,
        organizer,
        contact,
        tags,
        poll,
        pollType,
        pollOptions = [],
        pollAnswers = [],
        date,
        time,
        endtime,
        room,
        club,
        image,
        file,
        comments = [],
        likes = [],
    } = event;

    return (
        <div style={{ padding: '2rem' }}>
            <div className="event-details-container">
                <h2 className="event-title">{title}</h2>
                <img src={`https://campulse.onrender.com/uploads/${image}`} alt={title} className="event-image" />
                <p className="event-description"><strong>Description: </strong>{description}</p>

                <div className="event-info">
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Time:</strong> {convertTo12Hour(time)}</p>
                    <p><strong>End Time:</strong> {endtime ? convertTo12Hour(endtime) : "4:00 PM"}</p>
                    <p><strong>Club:</strong> {club}</p>
                    <p><strong>Organizer:</strong> {organizer}</p>
                    <p><strong>Contact:</strong> {contact}</p>
                    <p><strong>Room:</strong> {room ? room : "Seminar hall 1"}</p>
                </div>

                <div className="tags">
                    <p><strong>Type:</strong> {Array.isArray(tags) ? tags.join(", ") : tags}</p>
                </div>

                {pollType === "yesno" && pollOptions.length === 2 && (
                    <div className="poll-section">
                        <p>{poll?.question || "Are you attending?"}</p>

                        {pollOptions.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    id={`poll-${index}`}
                                    name="poll"
                                    value={option}
                                    checked={pollAnswer === option}
                                    onChange={() => handlePollSelect(option)}
                                />
                                <label htmlFor={`poll-${index}`}>{option}</label>
                            </div>
                        ))}

                        <div className="poll-results">
                            <h4>Poll Results:</h4>
                            <p>
                                Yes: {pollAnswers.filter((a) => a.answer === "Yes").length} | No: {pollAnswers.filter((a) => a.answer === "No").length}
                            </p>
                        </div>
                    </div>
                )}

                {file && (
                    <div className="event-file">
                        <button
                            onClick={() => window.open(`https://campulse.onrender.com/uploads/${file}`, "_blank")}
                            className="view-pdf-btn"
                        >
                            📄 View Attached PDF
                        </button>
                    </div>
                )}

                <div className="event-actions">
                    <button onClick={handleLike} className={`like-btn ${liked ? "liked" : ""}`}>
                        {liked ? "Unlike" : "Like"} ({likes.length})
                    </button>
                    <button onClick={handleInterested} className="interested-btn">
                        Mark as Interested ({interestedCount})
                    </button>
                </div>

                {/* Conditionally render the registration button or message */}
                {isRegistered ? (
                    <div className="register-event-btn">
                        <button disabled>You are already registered</button>
                    </div>
                ) : (
                    <div className="register-event-btn">
                        <button onClick={() => setShowRegisterModal(true)}>Register here</button>
                    </div>
                )}

                {showRegisterModal && (
                    <EventRegistrationModal
                        eventId={event._id}
                        minMembers={event.minMembers}
                        maxMembers={event.maxMembers}
                        qr={event.qr}
                        onClose={() => setShowRegisterModal(false)}
                    />
                )}

                <div className="comments-section">
                    <h3>Comments ({comments.length})</h3>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment"
                    />
                    <button onClick={handleCommentSubmit}>Submit</button>

                    <div className="comments-list">
                        {comments.map((c) => (
                            <div key={c._id} className="comment-item">
                                <p>
                                    <strong>{c.userId?.name || "Anonymous"} ({c.userId?.id || "Unknown ID"}):</strong>
                                </p>
                                {editingCommentId === c._id ? (
                                    <>
                                        <textarea
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                        />
                                        <button onClick={() => submitEditedComment(c._id)}>Save</button>
                                        <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <p>{c.text}</p>
                                )}
                                <small>{new Date(c.timestamp).toLocaleString()}</small>
                                {c.userId?._id === user._id && (
                                    <div>
                                        <button onClick={() => handleCommentEdit(c._id, c.text)}>Edit</button>
                                        <button
                                            onClick={() => deleteComment(c._id)}
                                            style={{ backgroundColor: "crimson" }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
