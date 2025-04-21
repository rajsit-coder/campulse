import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import "../styles/EventFeed.css";

const EventFeedPage = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({
        date: "",
        type: "",
        club: "",
        search: "",
    });

    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("https://campulse.onrender.com/api/events/all");
            const data = await res.json();

            const now = new Date();

            const upcomingEvents = data.filter((event) => {
                const timeString = event.time.length === 5 ? `${event.time}:00` : event.time;
                const eventDateTime = new Date(`${event.date}T${timeString}`);
                return eventDateTime >= now;
            });

            setEvents(upcomingEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    const handleInteraction = async (eventId, type) => {
        const url = `https://campulse.onrender.com/api/events/${eventId}/${type}`;
        try {
            await fetch(url, {
                method: "PUT", // Corrected to PUT
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id }),
            });
            fetchEvents(); // Refresh events to update UI
        } catch (err) {
            console.error("Interaction failed:", err);
        }
    };

    const filteredEvents = events.filter((event) => {
        return (
            (!filters.date || event.date === filters.date) &&
            (!filters.type || event.tags === filters.type) &&
            (!filters.club || event.club === filters.club) &&
            (!filters.search ||
                event.title.toLowerCase().includes(filters.search.toLowerCase()))
        );
    });

    return (
        <div className="event-feed-container">
            <h1 className="feed-title">Campus Events</h1>

            <div className="filters">
                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="Tech">Tech</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Workshop">Workshop</option>
                </select>
                <select
                    value={filters.club}
                    onChange={(e) => setFilters({ ...filters, club: e.target.value })}
                >
                    <option value="">All Clubs</option>
                    <option value="Robotics Club">Robotics Club</option>
                    <option value="Cultural Club">Cultural Club</option>
                    <option value="Coding Club">Coding Club</option>
                </select>
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
            </div>

            <div className="event-grid">
                {filteredEvents.map((event) => {
                    const liked = event.likes?.includes(user._id);
                    const interested = event.interested?.includes(user._id);

                    return (
                        <div key={event._id} className="event-card-wrapper">
                            <EventCard
                                event={{
                                    ...event,
                                    liked,
                                    interested,
                                }}
                                onLike={() => handleInteraction(event._id, "like")}
                                onInterested={() => handleInteraction(event._id, "interested")}
                            />
                            {console.log(event)}
                            <Link to={`/event/${event._id}`} className="event-details-link">
                                View Details
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventFeedPage;
