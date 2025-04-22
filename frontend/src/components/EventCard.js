import React from "react";
import "../styles/EventCard.css";

const EventCard = ({ event, onLike, onInterested }) => {
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const combinedDateTime = new Date(`${event.date}T${event.time}`);

  const formattedDateTime = combinedDateTime.toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
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

  return (
    <div className="event-cards">
      <img
        src={`https://campulse.onrender.com/uploads/${event.image}`}
        alt={event.title}
      />
      <div className="event-details">
        <h3>{event.title}</h3>
        <p>
          <strong>Date:</strong> {formattedDateTime}
        </p>
        <p>
          <strong>Club:</strong> {event.club} | <strong>Type:</strong> {event.tags}
        </p>
        <p>
          <strong>Room No:- </strong>
          {event.room || "Seminar Hall 1"}
        </p>

        <p>
          <strong>End Time:- </strong>
          {event.endtime ? convertTo12Hour(event.endtime) : "4:00 PM"}
        </p>
        <p>{truncateText(event.description, 200)}</p>

        <div className="event-actions">
          <button
            className={`interested-btn ${event.interested ? "active" : ""}`}
            onClick={onInterested}
          >
            {event.interested ? "Marked Interested" : "Mark Interested"}
          </button>

          <div className="like-action">
            <button
              className={`like-btn ${event.liked ? "active" : ""}`}
              onClick={onLike}
            >
              {event.liked ? "Liked" : "Like"}
            </button>
            <span>{event.liked ? '❤️' : '🩶'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
