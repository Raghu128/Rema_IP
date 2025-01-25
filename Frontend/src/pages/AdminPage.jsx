import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/adminPage.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "btech", // default role in lowercase
  });
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "btech",
  });
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.user);

  // Fetch users on component mount
  useEffect(() => {
    axios
      .get("/api/v1/user")
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => {
        setError("Failed to load users.");
      });
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError("All fields are required.");
      return;
    }
    try {
      await axios.post(
        "/api/v1/user/add",
        { ...newUser, role: newUser.role.toLowerCase() }, // Ensure role is lowercase
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewUser({ name: "", email: "", password: "", role: "btech" });
      setError("");
      window.location.reload(); // Refresh user list
    } catch (err) {
      setError("Failed to add user.");
    }
  };

  const handleDeleteUser = async () => {
    if (!editUser.id) {
      setError("Please select a user to delete.");
      return;
    }
    try {
      await axios.delete(`/api/v1/user/${editUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter((user) => user._id !== editUser.id)); // Update local state
      setEditUser({ id: "", name: "", email: "", role: "btech" }); // Reset edit form
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser.id || !editUser.name || !editUser.email) {
      setError("All fields are required for update.");
      return;
    }
    try {
      await axios.put(
        `/api/v1/user/update/${editUser.id}`,
        { ...editUser, role: editUser.role.toLowerCase() }, // Ensure role is lowercase
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditUser({ id: "", name: "", email: "", role: "btech" });
      setError("");
      window.location.reload(); // Refresh user list
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  console.log(user);

  if (!user || user.role !== "admin") {
    return (
      <>
        {user && <div>{user.name}</div>}
        <h1>Unauthorized</h1>
      </>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="add-user-section">
        <h2 className="section-title">Add User</h2>
        <div className="admin-input-filed">
          <input
            className="input-field"
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="input-field"
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value.toLowerCase() })
            }
          >
            <option value="faculty">Faculty</option>
            <option value="btech">BTech</option>
            <option value="mtech">MTech</option>
            <option value="phd">PHD</option>
            <option value="intern">INTERN</option>
            <option value="other">OTHER</option>
          </select>
        </div>
        <button className="button" onClick={handleAddUser}>Add User</button>
      </div>

      <div className="update-user-section">
        <h2 className="section-title">Update or Delete User</h2>
        <div className="admin-input-filed">
          <select
            className="input-field"
            onChange={(e) => {
              const selectedUser = users.find((u) => u._id === e.target.value);
              setEditUser({
                id: selectedUser?._id || "",
                name: selectedUser?.name || "",
                email: selectedUser?.email || "",
                role: selectedUser?.role || "btech",
              });
            }}
            value={editUser.id}
          >
            <option value="">Select User to Update/Delete</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>

          {editUser.id && (
            <>
              <input
                className="input-field"
                type="text"
                placeholder="Name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
              <input
                className="input-field"
                type="email"
                placeholder="Email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
              <select
                className="input-field"
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value.toLowerCase() })
                }
              >
                <option value="btech">BTech</option>
                <option value="mtech">MTech</option>
                <option value="phd">PHD</option>
                <option value="intern">INTERN</option>
                <option value="other">OTHER</option>
              </select>
              <button className="button" onClick={handleUpdateUser}>Update User</button>
              <button className="button delete-button" onClick={handleDeleteUser}>Delete User</button>
            </>
          )}
        </div>
      </div>

      <div className="user-list-section-delete">
        <h2 className="section-title">User List</h2>
        {users.map((user) => (
          <div className="user-item" key={user._id}>
            <p>{user.name} ({user.role})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
