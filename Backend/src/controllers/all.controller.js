import { User } from "../models/userSchema.js";
import { SponsorProject } from "../models/sponsorProjectSchema.js";
import { Supervisor } from "../models/supervisorSchema.js";
import { Project } from "../models/projectSchema.js";
import { MinutesOfMeeting } from "../models/minutesOfMeetingSchema.js";
import { VenueList } from "../models/venueListSchema.js";
import { Notification } from "../models/notificationSchema.js";
import { Equipment } from "../models/equipmentSchema.js";
import { FinanceBudget } from "../models/financeBudgetSchema.js";
import { Expense } from "../models/expenseSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Leave } from "../models/leaveSchema.js";




// Utility function for handling errors
const handleError = (res, error) => {
  res.status(500).json({ message: error.message });
};

const checkIfFaculty = async (req, res, next) => {
  const userId = req.user.id; // Assuming the user ID is stored in the session or token

  // Get the user from the database
  const user = await User.findById(userId);

  if (!user || user.role !== 'faculty') {
    return res.status(403).json({ message: 'Access denied: You must be a faculty member to view projects.' });
  }

  next(); // If the user is faculty, proceed to the next middleware/route handler
};

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

export async function handleUserSignup(req, res) {
  const { name, email, password, role } = req.body;
  const currentUser = req.user;
  
  try {
    // Check the current user's role
    if (currentUser.role === "faculty" && (role === "faculty" || role === "admin")) {
      return res.status(403).send("Faculty can only add students.");
    }
    if (currentUser.role !== "faculty" && currentUser.role !== "admin") {
      return res.status(403).send("Student can not add any one");
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // Save the user with the hashed password and role
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).send("User successfully created");
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("Error during signup");
  }
}



export async function handleUserLogout(req, res) {  
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];      

      if (!token) {
          return res.status(400).json({ message: "No token provided" });
      }

      res.clearCookie("token"); 

      return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
      handleError(res, error);
  }
}


export async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });    
    

    if (!user) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    let isPasswordValid;

    if (user.role === "admin") {
      // Validate admin password directly with an environment variable
      isPasswordValid = password === process.env.ADMIN_PASSWORD;
    } else {
      // Compare the entered password with the hashed password in the database for general users
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "7d" } // Token expiration
    );

    res.cookie("token", token, {
      httpOnly: true,       // Prevents access by JavaScript (protects against XSS attacks)
      secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
      sameSite: "strict",   // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000,      // Cookie expiration: 7 days
    });

    

    // Send token as part of the response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Error during login" });
  }
}


export const checkSession = (req, res) => {
  // Retrieve token from cookies or authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  // If no token is provided, respond with 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the JWT using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
    // Respond with the decoded user details
    return res.status(200).json({ user: decoded });
  } catch (error) {
    // Log the error for debugging
    console.error("Error validating token:", error);

    // Handle different JWT verification errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      // Generic error response for unexpected issues
      return res.status(500).json({ message: "Failed to validate session" });
    }
  }
};





export const getUsers = async (req, res) => {  
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    handleError(res, error);
  }
};

export const getUsersByid = async (req, res) => {
  const id = req.params.id;
    
  try {
    const user = await User.find({_id:id});
    
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};






// GET Leave by ID
export const getLeaveByid = async (req, res) => {
  const id = req.params.id;
  try {    
    // Using find() with an _id filter to match your user controller style
    const leave = await Leave.find({ user: id });
    res.status(200).json(leave);
  } catch (error) {
    handleError(res, error);
  }
};

// UPDATE Leave by ID
export const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
    });
    res.status(200).json(leave);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE Leave by ID
export const deleteLeave = async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    handleError(res, error);
  }
};



export const fetchLeavesByfacultyId = async (req, res) => {
  
  try {
    const { facultyId } = req.params;

    // 1) Find all supervisor docs where faculty_id = facultyId
    const supervisors = await Supervisor.find({ faculty_id: facultyId });

    // 2) Extract the student IDs from those supervisor docs
    const studentIds = supervisors.map((sup) => sup.student_id);

    // 3) Find all leaves for those students
    //    Optionally, populate the user field to get user details (name, email, etc.)
    const leaves = await Leave.find({ user: { $in: studentIds } })
      .populate("user", "name email role");

    res.status(200).json(leaves);
  } catch (error) {
    handleError(res, error);
  }
};




export const addLeave = async (req, res) => {
  try {
    const { user, from, to, reason } = req.body;
    // Create a new leave document with the provided data
    const newLeave = new Leave({ user, from, to, reason });
    await newLeave.save();

    res.status(201).json({
      success: true,
      leave: newLeave,
      message: "Leave added successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};




















// SponsorProject Controller
export const createSponsorProject = async (req, res) => {
  try {    
    const project = await SponsorProject.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    handleError(res, error);
  }
};

export const getSponsorProjects = async (req, res) => {
  try {
    const projects = await SponsorProject.find();
    res.status(200).json(projects);
  } catch (error) {
    handleError(res, error);
  }
};


export const getSponsorProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const sponsorProjects = await SponsorProject.find({ faculty_id: id });
    
    if (!sponsorProjects) {
      return res.status(404).json({ message: "Sponsor Project not found" });
    }

    res.status(200).json(sponsorProjects);
  } catch (error) {
    console.error("Error fetching sponsor project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateSponsorProject = async (req, res) => {
  try {
    const project = await SponsorProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(project);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteSponsorProject = async (req, res) => {
  try {
    await SponsorProject.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

// Supervisor Controller
export const createSupervisor = async (req, res) => {
  try {    
    const supervisor = await Supervisor.create(req.body);
    
    res.status(201).json(supervisor);
  } catch (error) {
    handleError(res, error);
  }
};

export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find().populate(["faculty_id", "student_id"]);
    res.status(200).json(supervisors);
  } catch (error) {
    handleError(res, error);
  }
};

export const getSupervisorById = async (req, res) => {
  try {
    const { id } = req.params;
    const supervisor = await Supervisor.find({ faculty_id: id })
      .populate("faculty_id", "name role ")
      .populate("student_id", "name role")
      .populate("committee", "name role");
    

    if (!supervisor || supervisor.length === 0) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json(supervisor);
  } catch (error) {
    console.error("Error fetching supervisor:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



export const updateSupervisor = async (req, res) => {
  try {
    const supervisor = await Supervisor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(supervisor);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteSupervisor = async (req, res) => {
  try {
    await Supervisor.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

// Similarly, implement controllers for other schemas...
// Example for Projects
export const createProject = async (req, res) => {
    
  try {
    const project = await Project.create(req.body);    
    res.status(201).json(project);
  } catch (error) {
    handleError(res, error);
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(["faculty_id", "team", "lead_author"]);
    res.status(200).json(projects);
  } catch (error) {
    handleError(res, error);
  }
};

export const getProjectById = async (req, res) => {
  const id = req.params.id;
  
  try {
    const project = await Project.find({
      $or: [{ faculty_id: id }, { team: id }]
    })
      .populate('faculty_id', 'name')
      .populate('team', 'name')
      .populate('lead_author', 'name');

    if (!project || project.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectByStudentId = async (req, res) => {
  const id = req.params.id;
  
  try {
    const project = await Project.find({
      team: { $in: [id] }
    })
      .populate('faculty_id', 'name')
      .populate('team', 'name')
      .populate('lead_author', 'name');

    if (!project || project.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(project);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteProject = async (req, res) => {  
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};



export const createMinutesOfMeeting = async (req, res) => {
  try {
    
    const minutes = await MinutesOfMeeting.create(req.body);
    res.status(201).json(minutes);
  } catch (error) {
    handleError(res, error);
  }
};
export const getMinutesOfMeetingById = async (req, res) => {
  const id = req.params.id;  
  try {
    // Find the Minutes of Meeting documents by pid and populate the added_by field with the user's name
    const meeting = await MinutesOfMeeting.find({ pid: id })
      .populate('added_by', 'name');

    // Check if any meeting exists
    if (!meeting || meeting.length === 0) {
      return res.status(404).json({ message: 'Minutes of Meeting not found' });
    }

    // Return the meeting details including the added_by name
    res.json(meeting);
  } catch (error) {
    console.error('Error fetching Minutes of Meeting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getMinutesOfMeetings = async (req, res) => {
  try {
    const minutes = await MinutesOfMeeting.find().populate(["pid", "added_by"]);
    res.status(200).json(minutes);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateMinutesOfMeeting = async (req, res) => {
  try {
    const minutes = await MinutesOfMeeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(minutes);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteMinutesOfMeeting = async (req, res) => {
  try {
    await MinutesOfMeeting.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};




// import { VenueList } from "../models/venueList.model.js";

export const createVenueList = async (req, res) => {
  try {
    const venue = await VenueList.create(req.body);
    res.status(201).json(venue);
  } catch (error) {
    handleError(res, error);
  }
};

export const getVenueLists = async (req, res) => {
  try {
    const venues = await VenueList.find().populate("added_by");
    res.status(200).json(venues);
  } catch (error) {
    handleError(res, error);
  }
};


export const getVenueByIdList = async (req, res) => {
  const venueIds = req.params.id;

  if (!venueIds) {
    return res.status(400).json({ message: 'Invalid or empty venue IDs array' });
  }

  try {
    // Find venues matching the given condition and populate the added_by field with the user's name
    const venues = await VenueList.find({ 
      $or: [{ added_by: venueIds }, { view: venueIds }]
    }).populate('added_by', 'name');

    res.status(200).json({ message: 'Venues retrieved successfully', venues });
  } catch (error) {
    console.error('Error retrieving venues by ID list:', error);
    res.status(500).json({ message: 'Failed to retrieve venues' });
  }
};







export const updateVenueList = async (req, res) => {
  try {
    const venue = await VenueList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(venue);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteVenueList = async (req, res) => {
  try {
    await VenueList.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};



// import { Notification } from "../models/notification.model.js";

export const createNotification = async (req, res) => {
  
  try {
    
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    handleError(res, error);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate("added_by");
    res.status(200).json(notifications);
  } catch (error) {
    handleError(res, error);
  }
};


export const getNotificationById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Notification ID is required' });
  }

  try {
    // Find the notification by ID and populate the added_by field with the user's name
    const notification = await Notification.find({
      $or: [{ added_by: id }, { view: id }]
    }).populate('added_by', 'name');

    if (!notification || notification.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification retrieved successfully', notification });
  } catch (error) {
    console.error('Error retrieving notification:', error);
    res.status(500).json({ message: 'Failed to retrieve notification' });
  }
};




export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(notification);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};




// import { Equipment } from "../models/equipment.model.js";

export const createEquipment = async (req, res) => {
  try {
    const { funding_by_srp_id, amount, name, date_of_purchase } = req.body;
    
    // Validate required fields
    if (!funding_by_srp_id || !amount || !name) {
      return res.status(400).json({ message: "Missing required fields: funding_by_srp_id, amount, or name." });
    }    
    // Fetch the finance budget for the given SRP ID
    const budget = await FinanceBudget.findOne({ srp_id: funding_by_srp_id });
    
    // Check if budget exists
    if (!budget) {
      return res.status(404).json({ message: "Budget not found for the given SRP ID." });
    }
    
    // Check if there is enough budget for equipment purchase
    // if (diffMoney < 0) {
    //   return res.status(400).json({ message: "Insufficient equipment budget." });
    // }
    
    // Create the equipment
    const equipment = await Equipment.create(req.body);

    // Create the corresponding expense record
    const expense = await Expense.create({
      srp_id: funding_by_srp_id,
      item: name,
      amount,
      head: "Equipment",
      payment_date: date_of_purchase,
    });

    // Deduct the amount from the equipment budget and save
    // budget.equipment -= amount;
    // await budget.save();

    res.status(201).json({ message: "Equipment and expense created successfully.", equipment, expense });
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};



export const getEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find().populate(["ownership", "funding_by_srp_id"]);
    res.status(200).json(equipments);
  } catch (error) {
    handleError(res, error);
  }
};

export const getEquipmentById = async (req, res) => {
    const { id } = req.params;    
    if (!id) {
      return res.status(400).json({ message: 'Equipment ID is required' });
    }
  
    try {
      // Find the equipment by ID and populate references
      const equipment = await Equipment.find({ownership : id});      
  
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
  
      // Return the equipment details
      res.status(200).json({ message: 'Equipment retrieved successfully', equipment });
    } catch (error) {
      console.error('Error retrieving equipment:', error);
      res.status(500).json({ message: 'Failed to retrieve equipment' });
    }
}

export const getEquipmentByUsingId = async (req, res) => {
  const { id } = req.params;    
  if (!id) {
    return res.status(400).json({ message: 'Equipment ID is required' });
  }

  try {    
    // Find the equipment by ID and populate references
    const equipment = await Equipment.find({usingUser : id});      

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Return the equipment details
    res.status(200).json({ message: 'Equipment retrieved successfully', equipment });
  } catch (error) {
    console.error('Error retrieving equipment:', error);
    res.status(500).json({ message: 'Failed to retrieve equipment' });
  }
}

export const updateEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    
    // Fetch old equipment details
    const oldEquipment = await Equipment.findById(equipmentId);
    if (!oldEquipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    
    // const oldPrice = oldEquipment.amount;
    const newPrice = req.body.amount;
    
    // Update the equipment details
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      req.body,
      { new: true }
    );
    
    // const priceDifference = oldPrice - newPrice;
    
    // Update Expense (Set new amount for the existing expense)
    
    const updatedExpense = await Expense.findOneAndUpdate(
      { srp_id: oldEquipment.funding_by_srp_id, item: oldEquipment.name },
      { $set: { amount: newPrice } },
      { new: true }
    );
    
    
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense record not found" });
    }
    
    // Update FinanceBudget (Increase/Decrease the equipment budget)
    
    // const updatedBudget = await FinanceBudget.findOneAndUpdate(
    //   { srp_id: oldEquipment.funding_by_srp_id },
    //   { $inc: { equipment: priceDifference } }, // Adjust equipment budget
    //   { new: true }
    // );

    // if (!updatedBudget) {
    //   return res.status(404).json({ message: "Finance budget record not found" });
    // }

    res.status(200).json(updatedEquipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ message: "Failed to update equipment" });
  }
};



export const deleteEquipment = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};





// import { FinanceBudget } from "../models/financeBudget.model.js";

export const createFinanceBudget = async (req, res) => {
  try {
    const budget = await FinanceBudget.create(req.body);
    res.status(201).json(budget);
  } catch (error) {
    handleError(res, error);
  }
};

export const getFinanceBudgets = async (req, res) => {
  try {
    const budgets = await FinanceBudget.find().populate("srp_id");
    res.status(200).json(budgets);
  } catch (error) {
    handleError(res, error);
  }
};

export const getFinanceBudgetById = async (req, res) => {
  const { id } = req.params; // Faculty ID

  if (!id) {
    return res.status(400).json({ message: "Faculty ID is required" });
  }

  try {
    // Step 1: Find all SponsorProjects associated with the given faculty ID

    const budgets = await FinanceBudget.find({ srp_id: id });
    
    res.status(200).json({
      message: "Finance Budgets retrieved successfully",
      budgets
    });
  } catch (error) {
    console.error("Error retrieving Finance Budget:", error);
    res.status(500).json({ message: "Failed to retrieve Finance Budget" });
  }
};







export const updateFinanceBudget = async (req, res) => {
  try {
    const budget = await FinanceBudget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(budget);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteFinanceBudget = async (req, res) => {
  try {
    await FinanceBudget.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};




// import { Expense } from "../models/expense.model.js";

export const createExpense = async (req, res) => {
  try {
    const { head, srp_id, amount } = req.body;

    // Create the expense document

    // Find the budget for the given srp_id
    const budget = await FinanceBudget.findOne({ srp_id });

    if (!budget) {
      return res.status(404).json({ message: "Finance budget not found." });
    }

    // Access the correct budget field dynamically (e.g., "equipment" if head = "equipment")
    // const currentAmount = budget[head]; // This dynamically accesses the field, e.g., budget.equipment
    

    // // Check if the amount exists and handle Decimal128 to number conversion
    // const currentAmountAsNumber = currentAmount ? currentAmount.valueOf() : 0;  // Convert Decimal128 to number

    // // Calculate the difference between the current amount and the expense amount
    // const diffMoney = currentAmountAsNumber - amount;
    

    // if (diffMoney < 0) {
    //   return res.status(400).json({ message: `Insufficient ${head} budget.` });
    // }

    // // Deduct the amount from the corresponding budget field
    // budget[head] = currentAmountAsNumber - amount;

    // // Save the updated budget
    // await budget.save();
    const expense = await Expense.create(req.body);


    // Respond with the created expense
    res.status(201).json(expense);

  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Failed to create expense" });
  }
};



export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("srp_id");
    res.status(200).json(expenses);
  } catch (error) {
    handleError(res, error);
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming user ID is passed as a route parameter
    
    // Find sponsor projects for the user
    const sponsorProjects = await SponsorProject.find({ faculty_id: userId });

    if (!sponsorProjects || sponsorProjects.length === 0) {
      return res.status(404).json({ message: "No sponsor projects found for this user." });
    }

    // Extract all srp_id values
    const srpIds = sponsorProjects.map(project => project._id);

    // Find expenses related to these sponsor projects and populate sponsor project details
    const expenses = await Expense.find({ srp_id: { $in: srpIds } }).populate("srp_id");

    // Structure the response to map expenses with their respective sponsor projects
    const expenseData = sponsorProjects.map(project => ({
      sponsorProject: {
        id: project._id,
        title: project.title,
        agency: project.agency,
        budget: project.budget,
      },
      expenses: expenses.filter(expense => expense.srp_id._id.equals(project._id)),
    }));

    res.status(200).json(expenseData);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Failed to fetch expenses." });
  }
};




export const updateExpense = async (req, res) => {
  try {
    // Fetch the expense document to get the old amount
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Save the old amount from the expense before updating
    const oldAmount = expense.amount;

    // Update the expense with the new data
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedExpense) {
      return res.status(400).json({ message: "Failed to update expense" });
    }

    // // Calculate the difference in amount
    // const amountDifference = oldAmount-updatedExpense.amount;

    // // Update the FinanceBudget (adjust the corresponding field by the amount difference)
    // const budget = await FinanceBudget.findOne({ srp_id: updatedExpense.srp_id });

    // if (!budget) {
    //   return res.status(404).json({ message: "Finance budget not found" });
    // }

    // // Determine which field to update (e.g., 'equipment' based on the expense category)
    // const head = updatedExpense.head;  // Assuming 'head' determines which category (equipment, travel, etc.)

    // const currentAmount = budget[head];

    // if (currentAmount == null) {
    //   return res.status(400).json({ message: "Invalid budget field" });
    // }

    // Adjust the corresponding field in the FinanceBudget
    // budget[head] = currentAmount + amountDifference;

    // Save the updated budget
    // await budget.save();

    // Respond with the updated expense
    res.status(200).json(updatedExpense);

  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};
