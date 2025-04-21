import React, { useState, useEffect } from "react";
import "../styles/AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const [searchRegNo, setSearchRegNo] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://campulse.onrender.com/users");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchRegNo(value);
    const filtered = users.filter((user) =>
      user.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleAssignRole = async (userId, newRole) => {
    try {
      const res = await fetch(`https://campulse.onrender.com/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        fetchUsers(); // Refresh user list after role change
      } else {
        const err = await res.json();
        alert("Failed to update role: " + err.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const flaggedData = [
    { id: 1, title: "Inappropriate Comment", flaggedBy: "Admin" },
    { id: 2, title: "Offensive Event", flaggedBy: "Moderator" },
  ];

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Registration Number"
          value={searchRegNo}
          onChange={handleSearch}
        />
      </div>

      {/* User List */}
      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>Reg. No</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() =>
                      handleAssignRole(user._id, user.role === "coordinator" ? "student" : "coordinator")
                    }
                    style={{
                      backgroundColor: user.role === "coordinator" ? "crimson" : "green",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {user.role === "coordinator" ? "Remove Coordinator" : "Assign Coordinator"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Flagged Section */}
      {/* <div className="flagged-section">
        <h3>Flagged Events/Comments</h3>
        {flaggedData.length === 0 ? (
          <p>No flagged events or comments.</p>
        ) : (
          <ul>
            {flaggedData.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> - Flagged by {item.flaggedBy}
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
};

export default AdminDashboardPage;
