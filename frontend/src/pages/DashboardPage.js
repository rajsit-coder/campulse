import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const res = await fetch("https://campulse.onrender.com/api/events/all");
            const data = await res.json();

            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (storedUser && storedUser._id) {
                const userEvents = data.filter(event => event.userId === storedUser._id);
                setEvents(userEvents);
            } else {
                console.warn("No user found in localStorage.");
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };


    const handleDelete = async (eventId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`https://campulse.onrender.com/api/events/${eventId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setEvents(events.filter((e) => e._id !== eventId));
            } else {
                console.error("Failed to delete event.");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (<
        div className="Main-DashBoard" > {
            events.length === 0 ? (<
                p style={
                    { textAlign: "center", marginTop: "2rem" }} > No events found. < /p>
                ) : (
                events.map((event) => ( <
                    div key={event._id}
                    className="DashBoard-Card" >
                    <
                    div className="event-cards-dash" >
                        <
                            img src={
                                event.image ?
                                    `https://campulse.onrender.com/uploads/${event.image}` :
                                    "https://via.placeholder.com/300x200?text=No+Image"
                            }
                            alt={event.title}
                        /> <
                    div className="event-details-dash" >
                            <
                    h3 > {event.title} < /h3> <
                    p >
                                    <
                    strong > Date: < /strong> {event.date}{" "} <
                    strong > Time: < /strong> {event.time} <
                                                br />
                                            <
                    strong > Club: < /strong> {event.club}{" "} <
                    strong > Type: < /strong> {event.tags || "General"} <
                    /p> <
                    p className="dashboard-p" > {truncateText(event.description, 100)} < /p> <
                    div className="dashboard-btn" >
                                                            <
                    button className="dashboard-edit"
                                                                onClick={
                                                                    () => navigate(`/edit/${event._id}`)} >
                                                                Edit <
                    /button> <
                    button className="dashboard-response"
                                                                    onClick={
                                                                        () => navigate(`/event-responses/${event._id}`)} >
                                                                    View Responses <
                    /button> <
                    button className="dashboard-delete"
                                                                        onClick={
                                                                            () => handleDelete(event._id)} >
                                                                        Delete <
                    /button>

                                                                        <
                    /div> <
                    /div> <
                    /div> <
                    /div>
                                                                        ))
                                                                        )
        } <
        /div>
                                                                        );
};

                                                                        export default DashboardPage;
