// src/pages/MyProfilePage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MyProfilePage.css";

const MyProfilePage = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
    const [createdEvents, setCreatedEvents] = useState([]);
    const [interestedEvents, setInterestedEvents] = useState([]);
    const [likedEvents, setLikedEvents] = useState([]);
    const [comments, setComments] = useState([]);
    const [pollAnswers, setPollAnswers] = useState([]);

    useEffect(() => {
        if (!user._id) return;

        fetch(`https://campulse.onrender.com/api/events/user-data/${user._id}`)
            .then(res => res.json())
            .then(data => {
                setCreatedEvents(data.createdEvents || []);
                setInterestedEvents(data.interestedEvents || []);
                setLikedEvents(data.likedEvents || []);
                setComments(data.comments || []);
                setPollAnswers(data.pollAnswers || []);
            })
            .catch(err => console.error(err));
    }, [user]);

    const renderEvent = (event) => (
        <li key={event._id}>
            <Link to={`/event/${event._id}`}><strong>{event.title}</strong></Link>
            <p>{event.description}</p>
            <p className="event-date">{event.date}</p>
        </li>
    );

    return (
        <div style={{ padding: '30px' }}>
            <div className="my-profile-container">
                <h2>My Profile</h2>

                {user.role === "staff" && (
                    <div className="profile-section">
                        <h3>Created Events</h3>
                        {createdEvents.length > 0 ? (
                            <ul>{createdEvents.sort((a, b) => new Date(b.date) - new Date(a.date)).map(renderEvent)}</ul>
                        ) : <p>You have not created any events yet.</p>}
                    </div>
                )}

                <div className="profile-section">
                    <h3>Interested Events</h3>
                    {interestedEvents.length > 0 ? (
                        <ul>{interestedEvents.sort((a, b) => new Date(b.date) - new Date(a.date)).map(renderEvent)}</ul>
                    ) : <p>You have not marked any events as interested yet.</p>}
                </div>

                <div className="profile-section">
                    <h3>Liked Events</h3>
                    {likedEvents.length > 0 ? (
                        <ul>{likedEvents.sort((a, b) => new Date(b.date) - new Date(a.date)).map(renderEvent)}</ul>
                    ) : <p>You have not liked any events yet.</p>}
                </div>

                <div className="profile-section">
                    <h3>My Comments</h3>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((comment, i) => (
                                <li key={i}>
                                    <strong><Link to={`/event/${comment.eventId}`}>{comment.eventTitle}</Link>:</strong><br />
                                    {comment.text}
                                    <br /><small>{new Date(comment.timestamp).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>You have not made any comments yet.</p>}
                </div>

                <div className="profile-section">
                    <h3>My Poll Responses</h3>
                    {pollAnswers.length > 0 ? (
                        <ul>
                            {pollAnswers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((poll, i) => (
                                <li key={i}>
                                    <strong><Link to={`/event/${poll.eventId}`}>{poll.eventTitle}</Link>:</strong><br />
                                    Answered: <em>{poll.answer}</em>
                                    <br /><small>{new Date(poll.timestamp).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>You have not submitted any poll responses yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;
