import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // useNavigate added
import "../styles/AuthForm.css";


const RegisterPage = () => {
    const navigate = useNavigate();
    const [isStaff, setIsStaff] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contactNumber: "",
        batch: "",
        branch: "",
        rollNumber: "",
        department: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, contactNumber, batch, branch, rollNumber, department, email, password } = formData;


        if (!email || !password || (!isStaff && (!batch || !branch || !rollNumber)) || (isStaff && !department)) {
            alert("All fields are required");
            return;
        }

        // Clean and format data before sending
        const data = isStaff
            ? {
                name,
                contactNumber,
                email,
                password,
                department,
            }
            : {
                name,
                contactNumber,
                email,
                password,
                batch,
                branch,
                rollNumber,
            };


        try {
            const response = await fetch(`https://campulse.onrender.com/register/${isStaff ? "staff" : "student"}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                // Optionally clear the form
                setFormData({
                    batch: "",
                    branch: "",
                    rollNumber: "",
                    department: "",
                    email: "",
                    password: "",
                });
                // Redirect to login
                navigate("/login");
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div style={{ paddingTop: '50px' }}>
            <div className="auth-form-container">
                <h2>{isStaff ? "Staff Registration" : "Student Registration"}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isStaff}
                                onChange={() => setIsStaff(!isStaff)}
                            />
                            Register as Staff
                        </label>
                    </div>

                    {!isStaff && (
                        <>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="contactNumber">Contact Number:</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    pattern="[0-9]{10}"
                                    title="Enter a 10-digit phone number"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="batch">Batch:</label>
                                <select
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Batch</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="branch">Branch:</label>
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Branch</option>
                                    <option value="CSE">CSE</option>
                                    <option value="AIML">AIML</option>
                                    <option value="CE">CE</option>
                                    <option value="CECA">CECA</option>
                                    <option value="ME">ME</option>
                                    <option value="EE">EE</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="rollNumber">Roll Number (1-70):</label>
                                <input
                                    className="roll-input"
                                    type="number"
                                    name="rollNumber"
                                    value={formData.rollNumber}
                                    onChange={handleChange}
                                    min="1"
                                    max="70"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {isStaff && (
                        <div>
                            <label htmlFor="department">Department:</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="ME">ME</option>
                                <option value="EE">EE</option>
                                <option value="CE">CE</option>
                                <option value="AIML">AIML</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Register
                    </button>
                </form>

                <div className="switch-page">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
