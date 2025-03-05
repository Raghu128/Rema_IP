// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import "../../styles/AddSupervisorForm.css";
// import { useNavigate } from "react-router-dom";

// const AddSupervisorForm = () => {
//   const { user } = useSelector((state) => state.user);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     faculty_id: "",
//     student_id: "",
//     joining: "",
//     thesis_title: "",
//     committee: [],  // This will hold an array of selected faculty IDs
//     stipend: "0",
//     funding_source: "",
//     srpId: null,
//   });

//   const [students, setStudents] = useState([]);
//   const [supervisors, setSupervisors] = useState([]); // Supervisors for SRP
//   const [supervisorList, setSupervisorList] = useState([]); // All supervisors
//   const [selectedSupervisor, setSelectedSupervisor] = useState(null);
//   const [message, setMessage] = useState("");
//   const [sponsors, setSponsor] = useState([]);


//   // Fetch sponsors based on user.id
//   useEffect(() => {
//     const fetchSponsors = async () => {
//       try {
//         if (user?.id) {
//           const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
//           setSponsor(response.data); // Store sponsors in state
//           setMessage("");
//         }
//       } catch (error) {
//         console.error("Error fetching sponsors:", error);
//         setMessage("Failed to fetch sponsors");
//       }
//     };

//     fetchSponsors();
//   }, [user]);


//   // Fetch students and supervisors on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [usersRes, supervisorsRes] = await Promise.all([
//           axios.get("/api/v1/user"),
//           axios.get(`/api/v1/supervisors/${user.id}`),
//         ]);
//         setStudents(usersRes.data);
//         setSupervisorList(supervisorsRes.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setMessage("Failed to fetch data");
//       }
//     };

//     if (user?.id) fetchData();
//   }, [user]);

//   useEffect(() => {
//     if (user?.id) {
//       setFormData((prevData) => ({
//         ...prevData,
//         faculty_id: user.id,
//       }));
//     }
//   }, [user]);

//   const handleSelectSupervisor = (supervisor) => {
//     setSelectedSupervisor(supervisor);
//     const joiningDate = new Date(supervisor.joining);
//     const formattedJoiningDate = joiningDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
//     console.log(supervisor.srpId);
//     if (user?.id) {
//       setFormData((prevData) => ({
//         ...prevData,
//         faculty_id: user.id,
//       }));
//     }

//     setFormData({
//       faculty_id: supervisor.faculty_id,
//       student_id: supervisor.student_id,
//       joining: formattedJoiningDate,
//       thesis_title: supervisor.thesis_title,
//       committee: supervisor.committee,
//       stipend: supervisor.stipend?.$numberDecimal || 0,
//       funding_source: supervisor.funding_source,
//       srpId: supervisor.srpId,
//     });
//   };



//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       if (name === "committee") {
//         setFormData({
//           ...formData,
//           committee: checked
//             ? [...formData.committee, value]
//             : formData.committee.filter((id) => id !== value),
//         });
//       }
//     } else if (type === "number") {
//       setFormData({
//         ...formData,
//         [name]: parseFloat(value), // Ensures that stipend is stored as a number
//       });
//     } else if (type === "date") {
//       setFormData({
//         ...formData,
//         [name]: value, // Ensures date is stored as a string in the correct format
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // console.log(formData);
    

//     try {
//       if (selectedSupervisor) {
//         // Update existing supervisor
//         await axios.put(`/api/v1/supervisors/${selectedSupervisor._id}`, formData);
//         setMessage("Supervisor updated successfully");
//       } else {
//         // Add new supervisor
//         await axios.post("/api/v1/supervisors", formData);
//         setMessage("Supervisor added successfully");
//       }

//       setFormData({
//         faculty_id: "",
//         student_id: "",
//         joining: "",
//         thesis_title: "",
//         committee: [],
//         stipend: "0",
//         funding_source: "",
//         srpId: null,
//       });

//       setSelectedSupervisor(null);

//       // Refresh supervisor list
//       const response = await axios.get(`/api/v1/supervisors/${user.id}`);
//       setSupervisorList(response.data);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setMessage("Failed to submit form");
//     }
//   };

//   const handleDeleteSupervisor = async (id) => {
//     try {
//       await axios.delete(`/api/v1/supervisors/${id}`);
//       setMessage("Supervisor deleted successfully");
//       setSupervisorList(supervisorList.filter((sup) => sup._id !== id));
//     } catch (error) {
//       console.error("Error deleting supervisor:", error);
//       setMessage("Failed to delete supervisor");
//     }
//   };


//   return (
//     <div className="supervisor-form-container">
//       <button onClick={() => navigate(-1)}>Go Back</button>
//       <h2 className="supervisor-title">
//         {selectedSupervisor ? "Update Supervisor" : "Add Supervisor"}
//       </h2>
//       {message && <p className="supervisor-message">{message}</p>}

//       {/* List of Existing Supervisors */}
//       <div className="supervisor-list">
//         <h3>Existing Supervisors</h3>
//         {supervisorList.length > 0 ? (
//           <ul>
//             {supervisorList.map((supervisor) => (
//               <li key={supervisor._id} className="supervisor-item">
//                 <p>
//                  {supervisor.thesis_title}
//                 </p>
//                 <div className="supervisor-edit-container">
//                 <button
//                   className="supervisor-edit-button"
//                   onClick={() => handleSelectSupervisor(supervisor)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="supervisor-delete-button"
//                   onClick={() => handleDeleteSupervisor(supervisor._id)}
//                 >
//                   Delete
//                 </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No supervisors found</p>
//         )}
//       </div>

//       {/* Add or Update Form */}
//       <form className="supervisor-form" onSubmit={handleSubmit}>
//         <div className="supervisor-field">
//           <label htmlFor="student_id" className="supervisor-label">Student:</label>
//           <select
//             id="student_id"
//             name="student_id"
//             value={formData.student_id || ""}
//             onChange={handleChange}
//             required
//             className="supervisor-select"
//           >
//             <option value="">Select a student</option>
//             {students
//               .filter((student) => student.role !== "faculty" && student.role !== "admin")
//               .map((student) => (
//                 <option key={student._id} value={student._id}>
//                   {student.name} ({student.email})
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div className="supervisor-field">
//           <label htmlFor="joining" className="supervisor-label">Joining Date:</label>
//           <input
//             type="date"
//             id="joining"
//             name="joining"
//             value={formData.joining}
//             onChange={handleChange}
//             required
//             className="supervisor-input"
//           />
//         </div>

//         <div className="supervisor-field">
//           <label htmlFor="thesis_title" className="supervisor-label">Thesis Title:</label>
//           <input
//             type="text"
//             id="thesis_title"
//             name="thesis_title"
//             value={formData.thesis_title}
//             onChange={handleChange}
//             required
//             className="supervisor-input"
//           />
//         </div>

//         <div className="supervisor-field">
//           <label className="supervisor-label">Committee (Faculty):</label>
//           <div className="committee-checkboxes">
//             {students
//               .filter((faculty) => faculty.role === "faculty")
//               .map((faculty) => (
//                 <div key={faculty._id} className="committee-checkbox">
//                   <input
//                     type="checkbox"
//                     id={`committee-${faculty._id}`}
//                     name="committee"
//                     value={faculty._id}
//                     checked={formData.committee.includes(faculty._id)}
//                     onChange={handleChange}
//                   />
//                   <label htmlFor={`committee-${faculty._id}`}>
//                     {faculty.name} ({faculty.email})
//                   </label>
//                 </div>
//               ))}
//           </div>
//         </div>

//         <div className="supervisor-field">
//           <label htmlFor="stipend" className="supervisor-label">Stipend:</label>
//           <input
//             type="number"
//             id="stipend"
//             name="stipend"
//             value={formData.stipend}
//             onChange={handleChange}
//             min="0"
//             className="supervisor-input"
//           />
//         </div>

//         <div className="supervisor-field">
//           <label htmlFor="funding_source" className="supervisor-label">Funding Source:</label>
//           <input
//             type="text"
//             id="funding_source"
//             name="funding_source"
//             value={formData.funding_source}
//             onChange={handleChange}
//             className="supervisor-input"
//           />
//         </div>

//         {/* <div className="supervisor-field">
//           <label htmlFor="srpId" className="supervisor-label">Select SRP ID:</label>
//           <select
//             id="srpId"
//             name="srpId"
//             value={formData.srpId || ""}
//             onChange={handleChange}
//             className="supervisor-select"
//           >
//             <option value="">Select a Sponsor </option>
//             {supervisors.map((project) => (
//               <option key={project._id} value={project.srpId}>
//                 {project.srpId} ({project.srpId})
//               </option>
//             ))}
//           </select>
//         </div> */}

//         <div className="supervisor-field">
//           <label htmlFor="srpId" className="supervisor-label">Select SRP ID:</label>
//           <select
//             id="srpId"
//             name="srpId"
//             value={formData.srpId || ""}
//             onChange={handleChange}
//             className="supervisor-select"
//           >
//             <option value="">Select a Sponsor</option>
//             {sponsors.map((sponsor) => (
//               <option key={sponsor._id} value={sponsor._id}>
//                 {sponsor.agency}
//               </option>
//             ))}
//           </select>
//         </div>


//         <button type="submit" className="supervisor-button">
//           {selectedSupervisor ? "Update Supervisor" : "Add Supervisor"}
//         </button>


//       </form>
//     </div>
//   );
// };

// export default AddSupervisorForm;







import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/AddSupervisorForm.css";
import { useNavigate } from "react-router-dom";

const AddSupervisorForm = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    faculty_id: "",
    student_id: "",
    joining: "",
    thesis_title: "",
    committee: [],
    stipend: "0",
    funding_source: "",
    srpId: null,
  });

  const [students, setStudents] = useState([]);
  const [supervisorList, setSupervisorList] = useState([]);
  const [message, setMessage] = useState("");
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        if (user?.id) {
          const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
          setSponsors(response.data);
        }
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    fetchSponsors();
  }, [user]);

  const fetchSupervisor = async () => {
    try {
      const [usersRes, supervisorsRes] = await Promise.all([
        axios.get("/api/v1/user"),
        axios.get(`/api/v1/supervisors/${user.id}`),
      ]);
      setStudents(usersRes.data);
      setSupervisorList(supervisorsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if user is null
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.id) fetchSupervisor();
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        faculty_id: user.id,
      }));
    }
  }, [user]);

  const handleStudentChange = (e) => {
    const selectedStudentId = e.target.value;
    const existingSupervisor = supervisorList.find((sup) => sup.student_id === selectedStudentId);

    if (existingSupervisor) {
      const joiningDate = new Date(existingSupervisor.joining).toISOString().split("T")[0];
      setFormData({
        faculty_id: user.id,
        student_id: existingSupervisor.student_id,
        joining: joiningDate,
        thesis_title: existingSupervisor.thesis_title,
        committee: existingSupervisor.committee,
        stipend: existingSupervisor.stipend?.$numberDecimal || "0",
        funding_source: existingSupervisor.funding_source,
        srpId: existingSupervisor.srpId,
      });
    } else {
      setFormData({
        faculty_id: user.id,
        student_id: selectedStudentId,
        joining: "",
        thesis_title: "",
        committee: [],
        stipend: "0",
        funding_source: "",
        srpId: null,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "committee") {
      setFormData({
        ...formData,
        committee: checked
          ? [...formData.committee, value]
          : formData.committee.filter((id) => id !== value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingSupervisor = supervisorList.find((sup) => sup.student_id === formData.student_id);
      if (existingSupervisor) {
        await axios.put(`/api/v1/supervisors/${existingSupervisor._id}`, formData);
        setMessage("Supervisor updated successfully");
      } else {
        await axios.post("/api/v1/supervisors", formData);
        setMessage("Supervisor added successfully");
      }
      setFormData({
        faculty_id: user.id,
        student_id: "",
        joining: "",
        thesis_title: "",
        committee: [],
        stipend: "0",
        funding_source: "",
        srpId: null,
      });

      if (user?.id) fetchSupervisor();
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to submit form");
    }
  };

  return (
    <div className="supervisor-form-container">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="supervisor-title">{formData.student_id ? "Update Supervisor" : "Add Supervisor"}</h2>
      {message && <p className="supervisor-message">{message}</p>}
      <form className="supervisor-form" onSubmit={handleSubmit}>
        <label>Student:</label>
        <select name="student_id" value={formData.student_id} onChange={handleStudentChange} required>
          <option value="">Select a student</option>
          {students
              .filter((student) => student.role !== "faculty" && student.role !== "admin")
              .map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
        </select>

        <label>Joining Date:</label>
        <input type="date" name="joining" value={formData.joining} onChange={handleChange} required />

        <label>Thesis Title:</label>
        <input type="text" name="thesis_title" value={formData.thesis_title} onChange={handleChange} required />

        <label>Stipend:</label>
        <input type="number" name="stipend" value={formData.stipend} onChange={handleChange} />

        <label>Funding Source:</label>
        <input type="text" name="funding_source" value={formData.funding_source} onChange={handleChange} />

        <div className="supervisor-field">
          <label htmlFor="srpId" className="supervisor-label">Select SRP ID:</label>
          <select
            id="srpId"
            name="srpId"
            value={formData.srpId || ""}
            onChange={handleChange}
            className="supervisor-select"
          >
            <option value="">Select a Sponsor</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor._id} value={sponsor._id}>
                {sponsor.agency}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{formData.student_id ? "Update Supervisor" : "Add Supervisor"}</button>
      </form>
    </div>
  );
};

export default AddSupervisorForm;
