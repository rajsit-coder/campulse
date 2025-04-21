import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
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

        const { id, password } = formData;

        if (!id || !password) {
            alert("Please enter all fields");
            return;
        }

        const data = { id, password };

        try {
            const response = await fetch("https://campulse.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);

                // Store the full user object in localStorage
                localStorage.setItem("user", JSON.stringify(result.user));

                // Navigate based on role
                if (result.user.role === "superadmin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/home");
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Login failed");
        }
    };

    const texts = [
        "For the students, by the students",
        "One stop solution...Campulse",
        "Which event is next?",
    ];

    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState(texts[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setDisplayText(texts[textIndex]);
    }, [textIndex]);

    return (
        <div style={{ paddingTop: '50px' }}>
            <div className="auth-form-container">
                <h2>Login</h2>

                <form onSubmit={handleSubmit} className="inside_form">
                    <div className="form-animation">
                        <div>
                            <label htmlFor="id">ID:</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
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

                        <button type="submit" className="auth-btn login-btn">
                            Login
                        </button>
                    </div>

                    <div className="animated-text">
                        <p>{displayText}</p>
                    </div>
                </form>

                <div className="switch-page">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
