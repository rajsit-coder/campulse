import React, { useState } from "react";
import "../styles/EventRegistrationModal.css";

const EventRegistrationModal = ({ eventId, minMembers, maxMembers, qr, onClose }) => {
    const [teamName, setTeamName] = useState("");
    const [teamLeader, setTeamLeader] = useState("");
    const [memberCount, setMemberCount] = useState(minMembers);
    const [members, setMembers] = useState([]);
    const [utrNumber, setUtrNumber] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [message, setMessage] = useState("");
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            [field]: value,
        };
        setMembers(updatedMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (memberCount < minMembers || memberCount > maxMembers) {
            alert(`Members must be between ${minMembers} and ${maxMembers}`);
            return;
        }

        const formData = new FormData();
        formData.append("teamName", teamName);
        formData.append("teamLeader", teamLeader);
        formData.append("utrNumber", utrNumber);
        formData.append("eventId", eventId);
        formData.append("paymentScreenshot", paymentScreenshot);
        formData.append("memberCount", memberCount);
        formData.append("userId", user._id);

        // ✅ Send member details as JSON string
        formData.append("memberDetails", JSON.stringify(members));

        try {
            const res = await fetch(`https://campulse.onrender.com/api/events/register/${eventId}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setMessage("Registered successfully!");
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setMessage("Something went wrong.");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Team Registration</h3>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Team Name</label>
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                    <label>Team Leader Name</label>
                    <input
                        type="text"
                        placeholder="Team Leader Name"
                        value={teamLeader}
                        onChange={(e) => setTeamLeader(e.target.value)}
                        required
                    />
                    <label>Number of Members</label>
                    <input
                        type="number"
                        placeholder="Number of Members"
                        min={minMembers}
                        max={maxMembers}
                        value={memberCount}
                        onChange={(e) => {
                            const count = parseInt(e.target.value, 10);
                            setMemberCount(count);
                            setMembers(
                                Array.from({ length: count }, (_, i) => members[i] || { name: "", regNo: "", contact: "" })
                            );
                        }}
                        required
                    />

                    {Array.from({ length: memberCount }).map((_, i) => (
                        <div key={i} className="member-fields">
                            <input
                                type="text"
                                placeholder={`Member ${i + 1} Name`}
                                value={members[i]?.name || ""}
                                onChange={(e) => handleMemberChange(i, "name", e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder={`Member ${i + 1} Reg No`}
                                value={members[i]?.regNo || ""}
                                onChange={(e) => handleMemberChange(i, "regNo", e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder={`Member ${i + 1} Contact`}
                                value={members[i]?.contact || ""}
                                onChange={(e) => handleMemberChange(i, "contact", e.target.value)}
                                required
                            />
                        </div>
                    ))}

                    <div className="payment">
                        <p>Make Payment here</p>
                        <div className="payment-img">
                            <img src={`https://campulse.onrender.com/uploads/${qr}`}></img>
                        </div>
                    </div>
                    <label>UTR Number</label>
                    <input
                        type="text"
                        placeholder="UTR Number"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        required
                    />
                    <label>Upload Payment Screenshot</label>
                    <input type="file" accept="image/*" onChange={(e) => setPaymentScreenshot(e.target.files[0])} required />

                    <div className="modal-buttons">
                        <button className="modal-buttons-submit" type="submit">Submit</button>
                        <button className="modal-buttons-cancel" type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>

                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default EventRegistrationModal;
