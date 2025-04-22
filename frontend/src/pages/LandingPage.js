import React, { useState, useEffect } from "react";
import "../styles/LandingPage.css";

const LandingPage = () => {
    const [events, setEvents] = useState([]);

    const getRandomEvents = (allEvents, count = 2) => {
        const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("https://campulse.onrender.com/api/events"); // replace with your actual API URL
                const data = await response.json();
                const randomEvents = getRandomEvents(data);
                setEvents(randomEvents);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="landing-page">
            <header className="header">
                <h1>Campulse</h1>
                <p>Your Campus, Your Calendar.</p>
            </header>

            <div className="events-preview">
                <h2>Upcoming Events</h2>
                {events.length > 0 ? (
                    <div className="events-list">
                        {events.map((event) => (
                            <div key={event._id} className="event-card">
                                <h3>{event.title}</h3>
                                <p>{event.date} | {event.time}</p>
                                <p>{truncateText(event.description, 100)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No events available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
