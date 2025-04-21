import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarView.css";

const CalendarViewPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("https://campulse.onrender.com/api/events/all");
                const data = await response.json();
                setAllEvents(data);
            } catch (error) {
                console.error("Failed to load events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const onChange = (date) => {
        setSelectedDate(date);
    };

    // Filter events based on selected date
    const eventsForSelectedDate = allEvents.filter((event) => {
        const eventDate = new Date(event.date).toDateString();
        return eventDate === selectedDate.toDateString();
    });

    return (
        <div className="calendar-page-container">
            <h2 className="calendar-title">Event Calendar</h2>
            <div className="calendar-container">
                <ReactCalendar
                    onChange={onChange}
                    value={selectedDate}
                    showNeighboringMonth={false}
                    style={{ height: 500 }}
                />
            </div>
            <div className="events-list">
                {loading ? (
                    <p>Loading events...</p>
                ) : eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((event, index) => (
                        <div key={index} className="event-card">
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <small>{event.club} - {event.tags}</small>
                        </div>
                    ))
                ) : (
                    <p style={{ color: 'white', marginRight: '55px', fontSize: '1.5rem' }}>No events for this date</p>
                )}
            </div>
        </div>
    );
};

export default CalendarViewPage;
