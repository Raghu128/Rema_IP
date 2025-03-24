import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/adminPage.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("users");
  // const [schemaData, setSchemaData] = useState(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState("");



  // Add User state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "btech",
    status: "active",
  });

  // Update Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (activeSection === "users") {
      axios.get("/api/v1/user")
        .then((response) => setUsers(response.data))
        .catch(() => setMessage("Failed to load users."));
    }
  }, [activeSection]);



  // const fetchDatabaseSchema = async () => {
  //   try {
  //     setSchemaLoading(true);
  //     const response = await axios.get("/api/v1/db/schema");
  //     setSchemaData(response.data);
  //     setSchemaError("");
  //   } catch (err) {
  //     setSchemaError("Failed to load database schema");
  //   } finally {
  //     setSchemaLoading(false);
  //   }
  // };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setUsers(sorted);
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setMessage("All fields are required to add a user.");
      return;
    }

    try {
      await axios.post("/api/v1/user/add", 
        { ...newUser, role: newUser.role.toLowerCase() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage("User added successfully.");
      const res = await axios.get("/api/v1/user");
      setUsers(res.data);
      setNewUser({ name: "", email: "", password: "", role: "btech", status: "active" });
    } catch (err) {
      setMessage("Failed to add user.");
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await axios.delete(`/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(users.filter((u) => u._id !== id));
      setMessage("User deleted successfully.");
    } catch (err) {
      setMessage("Failed to delete user.");
    }
  };

  const generatePassword = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    return Array.from({ length: 12 }, () => 
      charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  };

  const handleResetPassword = async (id, name) => {
    if (!window.confirm(`Reset password for ${name}?`)) return;
    try {
      const newPassword = generatePassword();
      await axios.put(`/api/v1/user/${id}`, 
        { password: newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage(`Password reset for ${name}. New password: ${newPassword}`);
    } catch (err) {
      setMessage("Failed to reset password.");
    }
  };

  const openUpdateModal = (userObj) => {
    setEditingUser(userObj);
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await axios.put(`/api/v1/user/${editingUser._id}`, 
        {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role.toLowerCase(),
          status: editingUser.status,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage("User updated successfully.");
      const res = await axios.get("/api/v1/user");
      setUsers(res.data);
      setShowModal(false);
    } catch (err) {
      setMessage("Failed to update user.");
    }
  };

  const [expandedSchemas, setExpandedSchemas] = useState({});

  const toggleSchema = (schemaName) => {
    setExpandedSchemas(prev => ({
      ...prev,
      [schemaName]: !prev[schemaName]
    }));
  };

  const renderDatabaseSchema = () => {
    if (schemaLoading) return <p className="admin-page-loading">Loading schema...</p>;
    if (schemaError) return <p className="admin-page-error">{schemaError}</p>;
  
    const schemaData = [
      {
        name: "Equipment",
        schema: {
          name: { type: "String", required: true },
          ownership: { type: "ObjectId (ref: User)", required: true },
          funding_by_srp_id: { type: "ObjectId (ref: SponsorProject)", required: true },
          date_of_purchase: { type: "Date" },
          location: { type: "String" },
          usingUser: { type: "ObjectId (ref: User)" },
          amount: { type: "Decimal128", min: 0 },
          status: { type: "String", default: "available", enum: ['available', 'in use', 'maintenance', 'surrendered'] },
          remarks: { type: "String" },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "Expense",
        schema: {
          srp_id: { type: "ObjectId (ref: SponsorProject)", required: true },
          item: { type: "String", required: true },
          amount: { type: "Decimal128", required: true, min: 0 },
          head: { type: "String" },
          payment_date: { type: "Date" },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "FinanceBudget",
        schema: {
          srp_id: { type: "ObjectId (ref: SponsorProject)", required: true },
          year: { type: "Number", required: true },
          manpower: { type: "Decimal128", min: 0 },
          pi_compenstion: { type: "Decimal128", min: 0 },
          equipment: { type: "Decimal128", min: 0 },
          travel: { type: "Decimal128", min: 0 },
          expenses: { type: "Decimal128", min: 0 },
          outsourcing: { type: "Decimal128", min: 0 },
          contingency: { type: "Decimal128", min: 0 },
          consumable: { type: "Decimal128", min: 0 },
          others: { type: "Decimal128", min: 0 },
          overhead: { type: "Decimal128", min: 0 },
          gst: { type: "Decimal128", min: 0 },
          status: { type: "String", default: "pending", enum: ['approved', 'pending', 'rejected'] },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "Leave",
        schema: {
          user_id: { type: "ObjectId (ref: User)", required: true },
          faculty_id: { type: "ObjectId (ref: User)", required: true },
          from: { type: "Date", required: true },
          to: { type: "Date", required: true },
          reason: { type: "String", required: true },
          appliedOnPortal: { type: "Boolean", default: true },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "MinutesOfMeeting",
        schema: {
          pid: { type: "ObjectId (ref: Project)", required: true },
          text: { type: "String", required: true },
          added_by: { type: "ObjectId (ref: User)", required: true },
          date: { type: "Date", required: true },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "Notification",
        schema: {
          type: { type: "String", required: true },
          text: { type: "String", required: true },
          creation_date: { type: "Date", required: true },
          due_date: { type: "Date" },
          priority: { type: "String", default: "low", enum: ['low', 'medium', 'high'] },
          added_by: { type: "ObjectId (ref: User)", required: true },
          view: { type: "[ObjectId] (ref: User)" },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "Project",
        schema: {
          faculty_id: { type: "ObjectId (ref: User)", required: true },
          name: { type: "String", required: true },
          domain: { type: "String" },
          sub_domain: { type: "String" },
          creation_date: { type: "Date" },
          end_date: { type: "Date" },
          team: { type: "[ObjectId] (ref: User)" },
          lead_author: { type: "ObjectId (ref: User)" },
          status: { type: "String", default: "ongoing", enum: ['ongoing', 'completed', 'cancelled'] },
          venue: { type: "String" },
          remarks: { type: "String" },
          paper_url: { type: "String" },
          submission_url: { type: "String" },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "SponsorProject",
        schema: {
          faculty_id: { type: "ObjectId (ref: User)", required: true },
          agency: { type: "String", required: true },
          title: { type: "String", required: true },
          cfp_url: { type: "String" },
          status: { type: "String", default: "active", enum: ['active', 'inactive'] },
          start_date: { type: "Date" },
          duration: { type: "Number", min: 1 },
          budget: { type: "Decimal128", min: 0 },
          remarks: { type: "String" },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "Supervisor",
        schema: {
          faculty_id: { type: "ObjectId (ref: User)", required: true },
          student_id: { type: "ObjectId (ref: User)", required: true },
          joining: { type: "Date" },
          thesis_title: { type: "String" },
          committee: { type: "[ObjectId] (ref: User)" },
          stipend: { type: "Decimal128", min: 0 },
          funding_source: { type: "String" },
          srpId: { type: "ObjectId (ref: SponsorProject)", default: null },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      },
      {
        name: "User",
        schema: {
          name: { type: "String", required: true },
          role: { type: "String", required: true, enum: ['btech', 'faculty', 'admin', 'intern', 'mtech', 'phd', 'projectstaff'] },
          status: { type: "Boolean", default: true },
          email: { type: "String", unique: true, required: true },
          password: { type: "String", required: true },
          lastLogin: { type: "Date" },
          createdAt: { type: "Date", default: "Date.now" },
          updatedAt: { type: "Date", default: "Date.now" }
        }
      }
    ];
    
    
    return (
      <div className="admin-page-schema-container">
        {schemaData.map((collection) => (
          <div key={collection.name} className="admin-page-schema-card">
            <div 
              className="admin-page-schema-header" 
              onClick={() => toggleSchema(collection.name)}
            >
              <h3 className="admin-page-schema-title">{collection.name}</h3>
              <span className="admin-page-toggle-icon">
                {expandedSchemas[collection.name] ? '▼' : '►'}
              </span>
            </div>

            {expandedSchemas[collection.name] && (
              <div className="admin-page-schema-attributes">
                <div className="admin-page-attribute-header">
                  <span className="admin-page-field">Field</span>
                  <span className="admin-page-type">Type</span>
                  <span className="admin-page-required">Required</span>
                  <span className="admin-page-default">Default/Constraints</span>
                </div>
                {Object.entries(collection.schema).map(([field, details]) => (
                  <div key={field} className="admin-page-schema-row">
                    <span className="admin-page-field">{field}</span>
                    <span className="admin-page-type">{details.type}</span>
                    <span className="admin-page-required">{details.required ? "✓" : ""}</span>
                    <span className="admin-page-default">
                      {details.default ? details.default.toString() : 
                       details.min ? `min: ${details.min}` : "-"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!user || user.role !== "admin") return <h1 className="admin-page-unauthorized">Unauthorized</h1>;

  return (
    <div className="admin-page">
      <div className="admin-page-sidebar">
        <button
          className={`admin-page-sidebar-btn ${activeSection === "users" ? "admin-page-active" : ""}`}
          onClick={() => setActiveSection("users")}
        >
          Users
        </button>
        <button
          className={`admin-page-sidebar-btn ${activeSection === "database" ? "admin-page-active" : ""}`}
          onClick={() => setActiveSection("database")}
        >
          Database
        </button>
      </div>

      <div className="admin-page-content">
        {activeSection === "users" ? (
          <>
            <h1 className="admin-page-title">User Management</h1>
            {message && <div className="admin-page-message">{message}</div>}

            <div className="admin-page-add-user">
              <h2 className="admin-page-subtitle">Add New User</h2>
              <div className="admin-page-form">
                <input
                  type="text"
                  placeholder="Name"
                  className="admin-page-input"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="admin-page-input"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="admin-page-input"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                  className="admin-page-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="btech">BTech</option>
                  <option value="mtech">MTech</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
                <button className="admin-page-btn" onClick={handleAddUser}>Add User</button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search users..."
              className="admin-page-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="admin-page-user-list">
              <table className="admin-page-table">
                <thead>
                  <tr>
                    <th className="admin-page-table-header" onClick={() => handleSort("name")}>Name</th>
                    <th className="admin-page-table-header" onClick={() => handleSort("email")}>Email</th>
                    <th className="admin-page-table-header" onClick={() => handleSort("role")}>Role</th>
                    <th className="admin-page-table-header" onClick={() => handleSort("status")}>Status</th>
                    <th className="admin-page-table-header" onClick={() => handleSort("lastlogin")}>Last Login</th>
                    <th className="admin-page-table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="admin-page-table-row">
                      <td className="admin-page-table-cell">{user.name}</td>
                      <td className="admin-page-table-cell">{user.email}</td>
                      <td className="admin-page-table-cell">{user.role}</td>
                      <td className="admin-page-table-cell">{user.status ? "Active" : "Inactive"}</td>
                      <td className="admin-page-table-cell">{user.lastLogin ? new Date(user.lastLogin).toLocaleString(): "NEVER"}</td>
                      <td className="admin-page-table-cell admin-page-actions">
                        <button className="admin-page-action-btn" onClick={() => openUpdateModal(user)}>Edit</button>
                        <button className="admin-page-action-btn" onClick={() => handleDeleteUser(user._id, user.name)}>Delete</button>
                        <button className="admin-page-action-btn" onClick={() => handleResetPassword(user._id, user.name)}>Reset Password</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showModal && editingUser && (
              <div className="admin-page-modal">
                <div className="admin-page-modal-content">
                  <h2 className="admin-page-modal-title">Edit User</h2>
                  <label className="admin-page-modal-label">Name:</label>
                  <input
                    type="text"
                    className="admin-page-modal-input"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                  <label className="admin-page-modal-label">Email:</label>
                  <input
                    type="email"
                    className="admin-page-modal-input"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                  <label className="admin-page-modal-label">Role:</label>
                  <select
                    className="admin-page-modal-select"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  >
                    <option value="btech">BTech</option>
                    <option value="mtech">MTech</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                  <label className="admin-page-modal-label">Status:</label>
                  <select
                    className="admin-page-modal-select"
                    value={editingUser.status ? "active" : "inactive"}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value === "active" })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div className="admin-page-modal-buttons">
                    <button className="admin-page-modal-btn" onClick={handleUpdateUser}>Save</button>
                    <button className="admin-page-modal-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="admin-page-title">Database Schema</h1>
            {renderDatabaseSchema()}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;