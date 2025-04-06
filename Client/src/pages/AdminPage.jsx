import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/adminPage.css";

function AdminPage() {
  // State management
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeSection, setActiveSection] = useState("users");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    byRole: {}
  });

  // User management states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "btech",
    status: "active",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Database schema states
  const [expandedSchemas, setExpandedSchemas] = useState({});
  const [schemaViewMode, setSchemaViewMode] = useState("list");

  // Fetch users and calculate statistics
  useEffect(() => {
    if (activeSection === "users") {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get("/api/v1/user");
          setUsers(response.data);
          calculateStats(response.data);
          setMessage({ text: "", type: "" });
        } catch (err) {
          setMessage({ text: "Failed to load users.", type: "error" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsers();
    }
  }, [activeSection]);

  const calculateStats = (users) => {
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status).length,
      inactiveUsers: users.filter(u => !u.status).length,
      byRole: {}
    };

    users.forEach(user => {
      if (!stats.byRole[user.role]) {
        stats.byRole[user.role] = 0;
      }
      stats.byRole[user.role]++;
    });

    setStats(stats);
  };

  // Filter and sort users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && u.status;
    if (activeTab === "inactive") return matchesSearch && !u.status;
    return matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === "lastLogin") {
      // Handle potential null values for lastLogin
      const aValue = a[sortConfig.key] || new Date(0);
      const bValue = b[sortConfig.key] || new Date(0);
      return sortConfig.direction === "asc"
        ? aValue - bValue
        : bValue - aValue;
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // User management functions
  const generatePassword = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    return Array.from({ length: 12 }, () =>
      charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setMessage({ text: "All fields are required to add a user.", type: "error" });
      return;
    }

    if (!validateEmail(newUser.email)) {
      setMessage({ text: "Please enter a valid email address.", type: "error" });
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("/api/v1/user/add",
        { ...newUser, role: newUser.role.toLowerCase() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setMessage({
        text: `User ${newUser.name} added successfully.`,
        type: "success"
      });

      const res = await axios.get("/api/v1/user");
      setUsers(res.data);
      calculateStats(res.data);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "btech",
        status: "active"
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add user.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const updatedUsers = users.filter((u) => u._id !== id);
      setUsers(updatedUsers);
      calculateStats(updatedUsers);

      setMessage({
        text: `User ${name} deleted successfully.`,
        type: "success"
      });
    } catch (err) {
      setMessage({
        text: "Failed to delete user. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (id, name) => {
    if (!window.confirm(`Reset password for ${name}? A new password will be generated.`)) return;

    try {
      setIsLoading(true);
      const newPassword = generatePassword();
      await axios.put(`/api/v1/user/${id}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setMessage({
        text: `Password reset for ${name}`,
        type: "success"
      });
    } catch (err) {
      setMessage({
        text: "Failed to reset password. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateModal = (userObj) => {
    setEditingUser({
      ...userObj,
      status: userObj.status ? "active" : "inactive"
    });
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setIsLoading(true);
      setShowModal(false);
      await axios.put(`/api/v1/user/${editingUser._id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role.toLowerCase(),
          status: editingUser.status === "active",
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const res = await axios.get("/api/v1/user");
      setUsers(res.data);
      calculateStats(res.data);


      setMessage({
        text: "User updated successfully.",
        type: "success"
      });
      setShowModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update user.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Database schema functions
  const toggleSchema = (schemaName) => {
    setExpandedSchemas(prev => ({
      ...prev,
      [schemaName]: !prev[schemaName]
    }));
  };

  const renderDatabaseSchema = () => {
    const schemaData = [

      {
        name: "VenueList",
        description: "Conference venue information and important dates",
        schema: {
          venue: {
            type: "String",
            required: true,
            description: "Name of the conference venue"
          },
          year: {
            type: "Number",
            required: true,
            description: "Year of the conference"
          },
          url: {
            type: "String",
            description: "URL to conference website"
          },
          added_by: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "User who added this venue"
          },
          date: {
            type: "Date",
            description: "General conference date"
          },
          abstract_submission: {
            type: "Date",
            description: "Abstract submission deadline"
          },
          paper_submission: {
            type: "Date",
            description: "Full paper submission deadline"
          },
          author_response: {
            type: "Date",
            description: "Author response period"
          },
          meta_review: {
            type: "Date",
            description: "Meta review period"
          },
          notification: {
            type: "Date",
            description: "Notification date for acceptance/rejection"
          },
          commitment: {
            type: "Date",
            description: "Commitment deadline for authors"
          },
          main_conference_start: {
            type: "Date",
            description: "Start date of main conference"
          },
          main_conference_end: {
            type: "Date",
            description: "End date of main conference"
          },
          location: {
            type: "String",
            description: "Physical location of the conference"
          },
          time_zone: {
            type: "String",
            description: "Time zone for conference deadlines"
          },
          view: {
            type: "[ObjectId] (ref: User)",
            description: "Users who have viewed this venue"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this venue record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this venue record was last updated"
          }
        }
      },
      {
        name: "Equipment",
        description: "Research equipment inventory and tracking",
        schema: {
          name: {
            type: "String",
            required: true,
            description: "Name/description of the equipment"
          },
          ownership: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "Primary owner/custodian of the equipment"
          },
          funding_by_srp_id: {
            type: "ObjectId (ref: SponsorProject)",
            required: true,
            description: "Project that funded this equipment purchase"
          },
          date_of_purchase: {
            type: "Date",
            description: "Date when the equipment was purchased"
          },
          location: {
            type: "String",
            description: "Current physical location of the equipment"
          },
          usingUser: {
            type: "ObjectId (ref: User)",
            description: "User currently using/checked out the equipment"
          },
          amount: {
            type: "Decimal128",
            min: 0,
            description: "Purchase cost of the equipment"
          },
          status: {
            type: "String",
            default: "available",
            enum: ['available', 'in use', 'maintenance', 'surrendered'],
            description: "Current availability status of the equipment"
          },
          remarks: {
            type: "String",
            description: "Additional notes about the equipment"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this equipment record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this equipment record was last updated"
          }
        }
      },
      {
        name: "Expense",
        description: "Tracking of project-related expenses",
        schema: {
          srp_id: {
            type: "ObjectId (ref: SponsorProject)",
            required: true,
            description: "Sponsored project this expense belongs to"
          },
          item: {
            type: "String",
            required: true,
            description: "Description of the expense item"
          },
          amount: {
            type: "Decimal128",
            required: true,
            min: 0,
            description: "Amount spent"
          },
          head: {
            type: "String",
            description: "Budget head/category for this expense"
          },
          payment_date: {
            type: "Date",
            description: "Date when payment was made"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this expense record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this expense record was last updated"
          }
        }
      },
      {
        name: "FinanceBudget",
        description: "Budget allocations and approvals for sponsored projects",
        schema: {
          srp_id: {
            type: "ObjectId (ref: SponsorProject)",
            required: true,
            description: "Sponsored project this budget belongs to"
          },
          year: {
            type: "Number",
            required: true,
            description: "Financial year this budget applies to"
          },
          manpower: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for manpower/staffing"
          },
          pi_compenstion: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for principal investigator compensation"
          },
          equipment: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for equipment purchases"
          },
          travel: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for travel expenses"
          },
          expenses: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for miscellaneous expenses"
          },
          outsourcing: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for outsourced work"
          },
          contingency: {
            type: "Decimal128",
            min: 0,
            description: "Allocated contingency funds"
          },
          consumable: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for consumables"
          },
          others: {
            type: "Decimal128",
            min: 0,
            description: "Allocated budget for other unspecified categories"
          },
          overhead: {
            type: "Decimal128",
            min: 0,
            description: "Allocated overhead costs"
          },
          gst: {
            type: "Decimal128",
            min: 0,
            description: "Allocated GST/taxes"
          },
          status: {
            type: "String",
            default: "pending",
            enum: ['approved', 'pending', 'rejected'],
            description: "Approval status of this budget"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this budget record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this budget record was last updated"
          }
        }
      },
      {
        name: "Leave",
        description: "Leave applications and records",
        schema: {
          user_id: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "User applying for leave"
          },
          faculty_id: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "Approving faculty/supervisor"
          },
          from: {
            type: "Date",
            required: true,
            description: "Leave start date"
          },
          to: {
            type: "Date",
            required: true,
            description: "Leave end date"
          },
          reason: {
            type: "String",
            required: true,
            description: "Reason for leave"
          },
          appliedOnPortal: {
            type: "Boolean",
            default: true,
            description: "Whether leave was applied through the portal"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this leave record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this leave record was last updated"
          }
        }
      },
      {
        name: "MinutesOfMeeting",
        description: "Records of project meeting minutes",
        schema: {
          pid: {
            type: "ObjectId (ref: Project)",
            required: true,
            description: "Project these minutes belong to"
          },
          text: {
            type: "String",
            required: true,
            description: "Content of the meeting minutes"
          },
          added_by: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "User who recorded these minutes"
          },
          date: {
            type: "Date",
            required: true,
            description: "Date of the meeting"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this minutes record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this minutes record was last updated"
          }
        }
      },
      {
        name: "Notification",
        description: "System notifications and alerts",
        schema: {
          type: {
            type: "String",
            required: true,
            description: "Type/category of notification"
          },
          text: {
            type: "String",
            required: true,
            description: "Content of the notification"
          },
          creation_date: {
            type: "Date",
            required: true,
            description: "When the notification was created"
          },
          due_date: {
            type: "Date",
            description: "Relevant deadline for the notification"
          },
          priority: {
            type: "String",
            default: "low",
            enum: ['low', 'medium', 'high'],
            description: "Importance level of the notification"
          },
          added_by: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "User who created the notification"
          },
          view: {
            type: "[ObjectId] (ref: User)",
            description: "Users who have viewed this notification"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this notification record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this notification record was last updated"
          }
        }
      },
      {
        name: "Project",
        description: "Research project information and tracking",
        schema: {
          faculty_id: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "Principal investigator/faculty in charge"
          },
          name: {
            type: "String",
            required: true,
            description: "Name/title of the project"
          },
          domain: {
            type: "String",
            description: "Broad research domain"
          },
          sub_domain: {
            type: "String",
            description: "Specific sub-domain or focus area"
          },
          creation_date: {
            type: "Date",
            description: "When the project was initiated"
          },
          end_date: {
            type: "Date",
            description: "Expected or actual completion date"
          },
          team: {
            type: "[ObjectId] (ref: User)",
            description: "Team members working on the project"
          },
          lead_author: {
            type: "ObjectId (ref: User)",
            description: "Primary author/lead researcher"
          },
          status: {
            type: "String",
            default: "ongoing",
            enum: ['ongoing', 'completed', 'cancelled'],
            description: "Current status of the project"
          },
          venue: {
            type: "String",
            description: "Location where project work is conducted"
          },
          remarks: {
            type: "String",
            description: "Additional notes about the project"
          },
          paper_url: {
            type: "String",
            description: "URL to published papers from this project"
          },
          submission_url: {
            type: "String",
            description: "URL to submission portals/repositories"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this project record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this project record was last updated"
          }
        }
      },
      {
        name: "SponsorProject",
        description: "Sponsored research projects with funding details",
        schema: {
          faculty_id: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "Principal investigator"
          },
          agency: {
            type: "String",
            required: true,
            description: "Funding agency/organization"
          },
          title: {
            type: "String",
            required: true,
            description: "Title of the sponsored project"
          },
          cfp_url: {
            type: "String",
            description: "URL to call for proposal"
          },
          status: {
            type: "String",
            default: "active",
            enum: ['active', 'inactive'],
            description: "Current status of the sponsored project"
          },
          start_date: {
            type: "Date",
            description: "Project commencement date"
          },
          duration: {
            type: "Number",
            min: 1,
            description: "Duration of project in months"
          },
          budget: {
            type: "Decimal128",
            min: 0,
            description: "Total approved budget amount"
          },
          remarks: {
            type: "String",
            description: "Additional notes about the sponsored project"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this sponsored project record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this sponsored project record was last updated"
          }
        }
      },
      {
        name: "Supervisor",
        description: "Student-supervisor relationships and thesis information",
        schema: {
          faculty_id: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "Supervising faculty member"
          },
          student_id: {
            type: "ObjectId (ref: User)",
            required: true,
            description: "Student being supervised"
          },
          joining: {
            type: "Date",
            description: "Date when supervision began"
          },
          thesis_title: {
            type: "String",
            description: "Title of student's thesis/dissertation"
          },
          committee: {
            type: "[ObjectId] (ref: User)",
            description: "Thesis committee members"
          },
          stipend: {
            type: "Decimal128",
            min: 0,
            description: "Stipend amount if applicable"
          },
          funding_source: {
            type: "String",
            description: "Source of funding for the student"
          },
          srpId: {
            type: "ObjectId (ref: SponsorProject)",
            default: null,
            description: "Sponsored project funding this studentship"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When this supervision record was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When this supervision record was last updated"
          }
        }
      },
      {
        name: "User",
        description: "System user accounts and authentication",
        schema: {
          name: {
            type: "String",
            required: true,
            description: "Full name of the user"
          },
          role: {
            type: "String",
            required: true,
            enum: ['btech', 'faculty', 'admin', 'intern', 'mtech', 'phd', 'projectstaff'],
            description: "User's role in the system"
          },
          status: {
            type: "Boolean",
            default: true,
            description: "Whether the user account is active"
          },
          email: {
            type: "String",
            unique: true,
            required: true,
            description: "User's email address"
          },
          password: {
            type: "String",
            required: true,
            description: "Hashed password for authentication"
          },
          lastLogin: {
            type: "Date",
            description: "Timestamp of last successful login"
          },
          createdAt: {
            type: "Date",
            default: "Date.now",
            description: "When the user account was created"
          },
          updatedAt: {
            type: "Date",
            default: "Date.now",
            description: "When the user account was last updated"
          }
        }
      }
    ];
    if (schemaViewMode === "list") {
      return (
        <div className="admin-page-schema-list-container">
          {schemaData.map((collection) => (
            <div
              key={collection.name}
              className={`admin-page-schema-card ${expandedSchemas[collection.name] ? 'admin-page-expanded' : ''}`}
            >
              <div
                className="admin-page-schema-header"
                onClick={() => toggleSchema(collection.name)}
              >
                <div className="admin-page-schema-title">
                  <i className="fas fa-table admin-page-icon"></i>
                  <h3 className="admin-page-schema-name">{collection.name}</h3>
                  <span className="admin-page-schema-description">{collection.description}</span>
                </div>
                <span className="admin-page-toggle-icon">
                  {expandedSchemas[collection.name] ? '▼' : '►'}
                </span>
              </div>

              {expandedSchemas[collection.name] && (
                <div className="admin-page-schema-details">
                  <div className="admin-page-schema-attributes-header">
                    <span className="admin-page-attribute-field">Field</span>
                    <span className="admin-page-attribute-type">Type</span>
                    <span className="admin-page-attribute-required">Required</span>
                    <span className="admin-page-attribute-constraints">Constraints</span>
                    <span className="admin-page-attribute-description">Description</span>
                  </div>
                  {Object.entries(collection.schema).map(([field, details]) => (
                    <div key={field} className="admin-page-schema-attribute">
                      <span className="admin-page-attribute-field">{field}</span>
                      <span className="admin-page-attribute-type">{details.type}</span>
                      <span className="admin-page-attribute-required">
                        {details.required ? (
                          <span className="admin-page-required-badge">Yes</span>
                        ) : (
                          <span className="admin-page-optional-badge">No</span>
                        )}
                      </span>
                      <span className="admin-page-attribute-constraints">
                        {details.enum ? (
                          <span className="admin-page-enum-values">
                            {details.enum.join(", ")}
                          </span>
                        ) : details.default ? (
                          <span className="admin-page-default-value">
                            default: {details.default.toString()}
                          </span>
                        ) : details.min !== undefined ? (
                          <span className="admin-page-min-value">
                            min: {details.min}
                          </span>
                        ) : (
                          "-"
                        )}
                      </span>
                      <span className="admin-page-attribute-description">
                        {details.description || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // Card view implementation
      return (
        <div className="admin-page-schema-card-container">
          {schemaData.map((collection) => (
            <div key={collection.name} className="admin-page-schema-card-view">
              <div className="admin-page-schema-card-header">
                <i className="fas fa-table admin-page-icon"></i>
                <h3 className="admin-page-schema-card-name">{collection.name}</h3>
              </div>
              <div className="admin-page-schema-card-body">
                <p className="admin-page-schema-card-description">{collection.description}</p>
                <div className="admin-page-schema-card-stats">
                  <span className="admin-page-schema-stat">
                    <i className="fas fa-columns admin-page-icon"></i> {Object.keys(collection.schema).length} fields
                  </span>
                  <span className="admin-page-schema-stat">
                    <i className="fas fa-asterisk admin-page-icon"></i> {
                      Object.values(collection.schema).filter(f => f.required).length
                    } required
                  </span>
                </div>
              </div>
              <div
                className="admin-page-schema-card-footer"
                onClick={() => toggleSchema(collection.name)}
              >
                {expandedSchemas[collection.name] ? 'Hide details' : 'View details'}
              </div>

              {expandedSchemas[collection.name] && (
                <div className="admin-page-schema-card-expanded">
                  <ul className="admin-page-schema-fields-list">
                    {Object.entries(collection.schema).map(([field, details]) => (
                      <li key={field} className="admin-page-schema-field-item">
                        <strong className="admin-page-field-name">{field}</strong>: <span className="admin-page-field-type">{details.type}</span>
                        {details.required && <span className="admin-page-required-tag">required</span>}
                        {details.enum && (
                          <div className="admin-page-enum-values">
                            <span className="admin-page-enum-label">Allowed values:</span> {details.enum.join(", ")}
                          </div>
                        )}
                        {details.description && (
                          <div className="admin-page-field-description">{details.description}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }


  };

  // Authorization check
  if (!user || user.role !== "admin") {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <i className="fas fa-exclamation-triangle"></i>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <p>Please contact the system administrator if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  // Format last login date
  const formatLastLogin = (date) => {
    if (!date) return "Never logged in";

    const now = new Date();
    const lastLogin = new Date(date);
    const diffInDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return lastLogin.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Role display names
  const roleDisplayNames = {
    btech: "BTech Student",
    mtech: "MTech Student",
    phd: "PhD Scholar",
    faculty: "Faculty",
    admin: "Administrator",
    intern: "Intern",
    projectstaff: "Project Staff"
  };



  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; // Number of users to show per page
  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <div className="admin-page-dashboard">
      <nav className="admin-page-nav">
        <div className="admin-page-nav-header">
          <div className="admin-page-org-logo">
            <i className="fas fa-flask admin-page-icon"></i>
            <h2 className="admin-page-logo-text">Admin Portal</h2>
          </div>
          <div className="admin-page-nav-user-info">
            <div className="admin-page-user-avatar">
              A
            </div>
            <div className="admin-page-user-details">
              <span className="admin-page-user-role">Admin</span>
              <span className="admin-page-user-role">{roleDisplayNames[user.role] || user.role}</span>
            </div>
          </div>
        </div>

        <div className="admin-page-nav-items">
          <button
            className={`admin-page-nav-item ${activeSection === "users" ? "admin-page-active" : ""}`}
            onClick={() => setActiveSection("users")}
          >
            <i className="fas fa-users-cog admin-page-icon"></i>
            <span className="admin-page-nav-text">User Management</span>
            <div className="admin-page-nav-item-indicator"></div>
          </button>

          <button
            className={`admin-page-nav-item ${activeSection === "database" ? "admin-page-active" : ""}`}
            onClick={() => setActiveSection("database")}
          >
            <i className="fas fa-database admin-page-icon"></i>
            <span className="admin-page-nav-text">Database Schema</span>
            <div className="admin-page-nav-item-indicator"></div>
          </button>



        </div>

      </nav>

      {/* Main Content Area */}
      <main className="admin-page-content">
        {/* Header Section */}
        <header className="admin-page-content-header">
          <div className="admin-page-header-title">
            <h1 className="admin-page-main-title">
              {activeSection === "users" ? (
                <>
                  <i className="fas fa-users admin-page-icon"></i>
                  <span className="admin-page-title-text">User Management</span>
                </>
              ) : (
                <>
                  <i className="fas fa-project-diagram admin-page-icon"></i>
                  <span className="admin-page-title-text">Database Schema Explorer</span>
                </>
              )}
            </h1>
            <p className="admin-page-header-subtitle">
              {activeSection === "users"
                ? "Manage all user accounts and permissions"
                : "Explore and understand the database structure"}
            </p>
          </div>

          <div className="admin-page-header-controls">
            {activeSection === "users" && (
              <div className="admin-page-search-container">
                <i className="fas fa-search admin-page-search-icon"></i>
                <input
                  type="text"
                  placeholder="Search users by name, email or role..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page when search changes
                  }}
                  className="admin-page-search-input"
                />
              </div>
            )}

            <div className="admin-page-header-actions">
              {/* <button className="admin-page-btn-icon">
              <i className="fas fa-bell admin-page-icon"></i>
              <span className="admin-page-notification-badge">3</span>
            </button> */}

              <button className="admin-page-btn-icon">
                <i className="fas fa-question-circle admin-page-icon"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Message Alert */}
        {message.text && (
          <div className={`admin-page-alert admin-page-${message.type}`}>
            <div className="admin-page-alert-content">
              <i className={`fas ${message.type === "success" ? "fa-check-circle" :
                message.type === "error" ? "fa-exclamation-circle" :
                  "fa-info-circle"
                } admin-page-icon`}></i>
              <span className="admin-page-alert-text">{message.text}</span>
            </div>
            <button
              className="admin-page-alert-close"
              onClick={() => setMessage({ text: "", type: "" })}
            >
              &times;
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="admin-page-loading-overlay">
            <div className="admin-page-loading-spinner">
              <i className="fas fa-spinner fa-spin admin-page-icon"></i>
              <span className="admin-page-loading-text">Loading...</span>
            </div>
          </div>
        )}

        {/* User Management Section */}
        {activeSection === "users" && (
          <div className="admin-page-user-management">
            {/* Stats Cards */}
            <div className="admin-page-stats-container">
              <div className="admin-page-stat-card">
                <div className="admin-page-stat-icon admin-page-total-users">
                  <i className="fas fa-users admin-page-icon"></i>
                </div>
                <div className="admin-page-stat-info">
                  <h3 className="admin-page-stat-title">Total Users</h3>
                  <p className="admin-page-stat-value">{stats.totalUsers}</p>
                </div>
              </div>

              <div className="admin-page-stat-card">
                <div className="admin-page-stat-icon admin-page-active-users">
                  <i className="fas fa-user-check admin-page-icon"></i>
                </div>
                <div className="admin-page-stat-info">
                  <h3 className="admin-page-stat-title">Active Users</h3>
                  <p className="admin-page-stat-value">{stats.activeUsers}</p>
                </div>
              </div>

              <div className="admin-page-stat-card">
                <div className="admin-page-stat-icon admin-page-inactive-users">
                  <i className="fas fa-user-times admin-page-icon"></i>
                </div>
                <div className="admin-page-stat-info">
                  <h3 className="admin-page-stat-title">Inactive Users</h3>
                  <p className="admin-page-stat-value">{stats.inactiveUsers}</p>
                </div>
              </div>

              <div className="admin-page-stat-card">
                <div className="admin-page-stat-icon admin-page-roles">
                  <i className="fas fa-tags admin-page-icon"></i>
                </div>
                <div className="admin-page-stat-info">
                  <h3 className="admin-page-stat-title">Roles Distribution</h3>
                  <div className="admin-page-role-tags">
                    {Object.entries(stats.byRole).map(([role, count]) => (
                      <span key={role} className={`admin-page-role-tag admin-page-${role}`}>
                        {roleDisplayNames[role] || role}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Add User Card */}
            <div className="admin-page-card admin-page-add-user-card">
              <div className="admin-page-card-header">
                <i className="fas fa-user-plus admin-page-icon"></i>
                <h2 className="admin-page-card-title">Create New User</h2>
              </div>

              <div className="admin-page-card-body">
                <div className="admin-page-form-grid">
                  <div className="admin-page-input-group">
                    <label className="admin-page-label">Name <span className="admin-page-required">*</span></label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className={`admin-page-input ${!newUser.name ? "admin-page-input-error" : ""}`}
                    />
                  </div>

                  <div className="admin-page-input-group">
                    <label className="admin-page-label">Email  <span className="admin-page-required">*</span></label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className={`admin-page-input ${!newUser.email || !validateEmail(newUser.email) ? "admin-page-input-error" : ""}`}
                    />
                    {!newUser.email ? (
                      <span className="admin-page-error-message"></span>
                    ) : !validateEmail(newUser.email) && (
                      <span className="admin-page-error-message">Please enter valid Email</span>
                    )}
                  </div>

                  <div className="admin-page-input-group">
                    <label className="admin-page-label">Password <span className="admin-page-required">*</span></label>
                    <div className="admin-page-password-input-container">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="••••••••"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className={`admin-page-input ${!newUser.password ? "admin-page-input-error" : ""}`}
                      />
                    </div>
                    <div className="admin-page-password-strength">
                      <span className={`admin-page-strength-indicator ${newUser.password.length === 0 ? "" :
                        newUser.password.length < 6 ? "admin-page-weak" :
                          newUser.password.length < 10 ? "admin-page-medium" : "admin-page-strong"
                        }`}></span>
                      <span className="admin-page-strength-text">
                        {newUser.password.length === 0 ? "" :
                          newUser.password.length < 6 ? "Weak" :
                            newUser.password.length < 10 ? "Medium" : "Strong"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-page-input-group">
                    <label className="admin-page-label">Role <span className="admin-page-required">*</span></label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="admin-page-select"
                    >
                      <option value="btech">BTech Student</option>
                      <option value="mtech">MTech Student</option>
                      <option value="phd">PhD Scholar</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Administrator</option>
                      <option value="intern">Intern</option>
                      <option value="projectstaff">Project Staff</option>
                    </select>
                  </div>



                  <div className="admin-page-input-group">
                    <label className="admin-page-label">Actions</label>
                    <div className="admin-page-action-buttons">
                      <button
                        className="admin-page-btn-secondary"
                        onClick={() => setNewUser({
                          name: "",
                          email: "",
                          password: "",
                          role: "btech",
                          status: "active"
                        })}
                      >
                        <i className="fas fa-undo admin-page-icon"></i> Reset
                      </button>
                      <button
                        className="admin-page-btn-generate"
                        onClick={() => setNewUser({
                          ...newUser,
                          password: generatePassword()
                        })}
                      >
                        <i className="fas fa-key admin-page-icon"></i> Generate Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-page-form-actions">
                  <button
                    className="admin-page-btn-primary"
                    onClick={handleAddUser}
                    disabled={!newUser.name || !newUser.email || !newUser.password}
                  >
                    <i className="fas fa-user-plus admin-page-icon"></i> Create User
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="admin-page-card admin-page-data-table">
              <div className="admin-page-table-header">
                <h3 className="admin-page-table-title">
                  <i className="fas fa-table admin-page-icon"></i>
                  <span className="admin-page-table-title-text">Registered Users ({filteredUsers.length})</span>
                </h3>

                <div className="admin-page-table-controls">
                  <div className="admin-page-filter-tabs">
                    <button
                      className={`admin-page-filter-tab ${activeTab === "all" ? "admin-page-active" : ""}`}
                      onClick={() => handleTabChange("all")}
                    >
                      All ({stats.totalUsers})
                    </button>
                    <button
                      className={`admin-page-filter-tab ${activeTab === "active" ? "admin-page-active" : ""}`}
                      onClick={() => handleTabChange("active")}
                    >
                      Active ({stats.activeUsers})
                    </button>
                    <button
                      className={`admin-page-filter-tab ${activeTab === "inactive" ? "admin-page-active" : ""}`}
                      onClick={() => handleTabChange("inactive")}
                    >
                      Inactive ({stats.inactiveUsers})
                    </button>
                  </div>

                  <button
                    className="admin-page-btn-icon"
                    onClick={() => {
                      const fetchUsers = async () => {
                        setIsLoading(true);
                        try {
                          const response = await axios.get("/api/v1/user");
                          setUsers(response.data);
                          calculateStats(response.data);
                        } catch (err) {
                          setMessage({ text: "Failed to refresh users.", type: "error" });
                        } finally {
                          setIsLoading(false);
                        }
                      };
                      fetchUsers();
                    }}
                    title="Refresh"
                  >
                    <i className="fas fa-sync-alt admin-page-icon"></i>
                  </button>
                </div>
              </div>

              <div className="admin-page-table-container">
                <table className="admin-page-responsive-table">
                  <thead className="admin-page-table-head">
                    <tr className="admin-page-table-row">
                      <th className="admin-page-sortable" onClick={() => handleSort("name")}>
                        <div className="admin-page-th-content">
                          <span className="admin-page-th-text">Name</span>
                          {sortConfig.key === "name" && (
                            <i className={`fas fa-sort-${sortConfig.direction === "asc" ? "up" : "down"} admin-page-icon`}></i>
                          )}
                        </div>
                      </th>
                      <th className="admin-page-sortable" onClick={() => handleSort("email")}>
                        <div className="admin-page-th-content">
                          <span className="admin-page-th-text">Email</span>
                          {sortConfig.key === "email" && (
                            <i className={`fas fa-sort-${sortConfig.direction === "asc" ? "up" : "down"} admin-page-icon`}></i>
                          )}
                        </div>
                      </th>
                      <th className="admin-page-sortable" onClick={() => handleSort("role")}>
                        <div className="admin-page-th-content">
                          <span className="admin-page-th-text">Role</span>
                          {sortConfig.key === "role" && (
                            <i className={`fas fa-sort-${sortConfig.direction === "asc" ? "up" : "down"} admin-page-icon`}></i>
                          )}
                        </div>
                      </th>
                      <th className="admin-page-sortable" onClick={() => handleSort("status")}>
                        <div className="admin-page-th-content">
                          <span className="admin-page-th-text">Status</span>
                          {sortConfig.key === "status" && (
                            <i className={`fas fa-sort-${sortConfig.direction === "asc" ? "up" : "down"} admin-page-icon`}></i>
                          )}
                        </div>
                      </th>
                      <th className="admin-page-sortable" onClick={() => handleSort("lastLogin")}>
                        <div className="admin-page-th-content">
                          <span className="admin-page-th-text">Last Login</span>
                          {sortConfig.key === "lastLogin" && (
                            <i className={`fas fa-sort-${sortConfig.direction === "asc" ? "up" : "down"} admin-page-icon`}></i>
                          )}
                        </div>
                      </th>
                      <th className="admin-page-th-actions">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="admin-page-table-body">
                    {currentUsers.length > 0 ? (
                      currentUsers.map(user => (
                        <tr key={user._id} className="admin-page-table-row">
                          <td className="admin-page-table-cell">
                            <div className="admin-page-user-info">
                              <div className="admin-page-user-avatar">
                                {user.name[0].toUpperCase()}
                              </div>
                              <div className="admin-page-user-details">
                                <span className="admin-page-user-name">{user.name}</span>
                                <span className="admin-page-user-id">ID: {user._id.substring(18)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="admin-page-table-cell">
                            <a href={`mailto:${user.email}`} className="admin-page-user-email">
                              {user.email}
                            </a>
                          </td>
                          <td className="admin-page-table-cell">
                            <span className={`admin-page-role-badge admin-page-${user.role}`}>
                              {roleDisplayNames[user.role] || user.role}
                            </span>
                          </td>
                          <td className="admin-page-table-cell">
                            <span className={`admin-page-status-badge admin-page-${user.status ? 'active' : 'inactive'}`}>
                              <i className={`fas fa-circle admin-page-icon admin-page-${user.status ? 'active' : 'inactive'}`}></i>
                              {user.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="admin-page-table-cell">
                            <span className={`admin-page-last-login ${!user.lastLogin ? 'admin-page-never' : ''}`}>
                              {formatLastLogin(user.lastLogin)}
                            </span>
                          </td>
                          <td className="admin-page-table-cell">
                            <div className="admin-page-action-buttons">
                              <button
                                className="admin-page-btn-icon admin-page-warning"
                                onClick={() => openUpdateModal(user)}
                                title="Edit"
                              >
                                <i className="fas fa-edit admin-page-icon"></i>
                              </button>
                              <button
                                className="admin-page-btn-icon admin-page-danger"
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                title="Delete"
                              >
                                <i className="fas fa-trash-alt admin-page-icon"></i>
                              </button>
                              <button
                                className="admin-page-btn-icon admin-page-primary"
                                onClick={() => handleResetPassword(user._id, user.name)}
                                title="Reset Password"
                              >
                                <i className="fas fa-key admin-page-icon"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="admin-page-no-results">
                        <td colSpan="6" className="admin-page-no-results-cell">
                          <div className="admin-page-no-results-content">
                            <i className="fas fa-user-slash admin-page-icon"></i>
                            <p className="admin-page-no-results-text">No users found matching your criteria</p>
                            {searchQuery && (
                              <button
                                className="admin-page-btn-text"
                                onClick={() => {
                                  setSearchQuery("");
                                  setActiveTab("all");
                                }}
                              >
                                Clear search and filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="admin-page-table-footer">
                <div className="admin-page-pagination-controls">
                  <button
                    className="admin-page-btn-pagination"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || totalPages === 0}
                  >
                    <i className="fas fa-chevron-left admin-page-icon"></i>
                  </button>
                  <span className="admin-page-pagination-text">
                    Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                  </span>
                  <button
                    className="admin-page-btn-pagination"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <i className="fas fa-chevron-right admin-page-icon"></i>
                  </button>
                </div>
                <div className="admin-page-table-summary">
                  Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length} users
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database Schema Section */}
        {activeSection === "database" && (
          <div className="admin-page-schema-explorer">
            <div className="admin-page-schema-header">
              <div className="admin-page-schema-title">
                <h2 className="admin-page-schema-title-text">Database Structure</h2>
                <p className="admin-page-schema-subtitle">Explore the collections and their fields in the database</p>
              </div>

              <div className="admin-page-schema-controls">
                <div className="admin-page-view-toggle">
                  <button
                    className={`admin-page-view-toggle-btn ${schemaViewMode === "list" ? "admin-page-active" : ""}`}
                    onClick={() => setSchemaViewMode("list")}
                  >
                    <i className="fas fa-list admin-page-icon"></i> List View
                  </button>
                  <button
                    className={`admin-page-view-toggle-btn ${schemaViewMode === "cards" ? "admin-page-active" : ""}`}
                    onClick={() => setSchemaViewMode("cards")}
                  >
                    <i className="fas fa-th-large admin-page-icon"></i> Card View
                  </button>
                </div>

                {/* <div className="admin-page-search-container">
                <i className="fas fa-search admin-page-icon"></i>
                <input
                  type="text"
                  placeholder="Search collections..."
                  className="admin-page-search-input"
                />
              </div> */}
              </div>
            </div>

            {renderDatabaseSchema()}
          </div>
        )}

        {/* Edit User Modal */}
        {showModal && editingUser && (
          <div className="admin-page-modal-overlay">
            <div className="admin-page-modal">
              <div className="admin-page-modal-header">
                <h3 className="admin-page-modal-title">
                  <i className="fas fa-user-edit admin-page-icon"></i>

                  <span className="admin-page-modal-title-text">Edit User: {editingUser.name}</span>
                </h3>
                <button
                  className="admin-page-btn-icon admin-page-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="admin-page-modal-body">
                <div className="admin-page-input-group">
                  <label className="admin-page-label">Full Name <span className="admin-page-required">*</span></label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="admin-page-input"
                  />
                </div>

                <div className="admin-page-input-group">
                  <label className="admin-page-label">Email Address <span className="admin-page-required">*</span></label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="admin-page-input"
                  />
                </div>

                <div className="admin-page-input-group">
                  <label className="admin-page-label">Role <span className="admin-page-required">*</span></label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="admin-page-select"
                  >
                    <option value="btech">BTech Student</option>
                    <option value="mtech">MTech Student</option>
                    <option value="phd">PhD Scholar</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Administrator</option>
                    <option value="intern">Intern</option>
                    <option value="projectstaff">Project Staff</option>
                  </select>
                </div>

                <div className="admin-page-input-group">
                  <label className="admin-page-label">Status <span className="admin-page-required">*</span></label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      status: e.target.value
                    })}
                    className="admin-page-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="admin-page-modal-info">
                  <p className="admin-page-modal-info-item">
                    <i className="fas fa-info-circle admin-page-icon"></i>
                    <span className="admin-page-modal-info-text">User ID: {editingUser._id}</span>
                  </p>
                  <p className="admin-page-modal-info-item">
                    <i className="fas fa-calendar-alt admin-page-icon"></i>
                    <span className="admin-page-modal-info-text">Created: {new Date(editingUser.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="admin-page-modal-info-item">
                    <i className="fas fa-sync-alt admin-page-icon"></i>
                    <span className="admin-page-modal-info-text">Last updated: {editingUser.updatedAt ?
                      new Date(editingUser.updatedAt).toLocaleDateString() : "Never"}</span>
                  </p>
                </div>
              </div>

              <div className="admin-page-modal-footer">
                <button
                  className="admin-page-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="admin-page-btn-primary"
                  onClick={handleUpdateUser}
                >
                  <i className="fas fa-save admin-page-icon"></i> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );


}

export default AdminPage;