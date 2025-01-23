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


// Utility function for handling errors
const handleError = (res, error) => {
  res.status(500).json({ message: error.message });
};

// User Controller
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
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

    // Find the SponsorProject by ID and populate related fields
    const sponsorProject = await SponsorProject.findById(id).populate([
      "added_by",       // Assuming `added_by` is a reference to a user
      "related_field1", // Add other referenced fields if needed
      "related_field2",
    ]);

    if (!sponsorProject) {
      return res.status(404).json({ message: "Sponsor Project not found" });
    }

    res.status(200).json(sponsorProject);
  } catch (error) {
    console.error("Error fetching sponsor project:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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

    // Find the Supervisor by ID and populate referenced fields
    const supervisor = await Supervisor.findById(id)
      .populate("faculty_id", "name email role") // Populate faculty details
      .populate("student_id", "name email role") // Populate student details
      .populate("committee", "name email role")  // Populate committee members
      .populate("srpId", "title agency status"); // Populate sponsor project details

    if (!supervisor) {
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
    try {
      const project = await Project.findById(req.params.id);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
}

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

    try {
      // Find the Minutes of Meeting document by ID
      const meeting = await MinutesOfMeeting.findById(id)
        .populate('pid', 'name domain') // Populate project fields (name, domain) as an example
        .populate('added_by', 'name email'); // Populate user details (name, email) for the added_by field
  
      // Check if the meeting exists
      if (!meeting) {
        return res.status(404).json({ message: 'Minutes of Meeting not found' });
      }
  
      // Return the meeting details
      res.json(meeting);
    } catch (error) {
      console.error('Error fetching Minutes of Meeting:', error);
      res.status(500).json({ message: 'Server error' });
    }
}

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
    const { venueIds } = req.body;
  
    if (!Array.isArray(venueIds) || venueIds.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty venue IDs array' });
    }
  
    try {
      // Fetch venues matching the IDs in the array
      const venues = await VenueList.find({ _id: { $in: venueIds } }).populate('added_by view'); // Populate user references if needed
  
      // Return the venues
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
      // Find the notification by ID
      const notification = await Notification.findById(id).populate('added_by');
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      // Return the notification
      res.status(200).json({ message: 'Notification retrieved successfully', notification });
    } catch (error) {
      console.error('Error retrieving notification:', error);
      res.status(500).json({ message: 'Failed to retrieve notification' });
    }
}



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
    const equipment = await Equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    handleError(res, error);
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
      const equipment = await Equipment.findById(id)
        .populate('ownership', 'name email') // Populates ownership with user name and email
        .populate('funding_by_srp_id', 'name'); // Populates sponsor project name
  
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
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(equipment);
  } catch (error) {
    handleError(res, error);
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

export const getFinanceBudgetById = async (req, res) =>  {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "Finance Budget ID is required" });
    }
  
    try {
      // Find FinanceBudget by ID and populate the related SponsorProject
      const financeBudget = await FinanceBudget.findById(id).populate("srp_id", "name");
  
      if (!financeBudget) {
        return res.status(404).json({ message: "Finance Budget not found" });
      }
  
      res.status(200).json({
        message: "Finance Budget retrieved successfully",
        financeBudget,
      });
    } catch (error) {
      console.error("Error retrieving Finance Budget:", error);
      res.status(500).json({ message: "Failed to retrieve Finance Budget" });
    }
}




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
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    handleError(res, error);
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

export const getExpenseById = async (req, res) =>  {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }
  
    try {
      // Find Expense by ID and populate the related SponsorProject
      const expense = await Expense.findById(id).populate("srp_id", "name");
  
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      res.status(200).json({
        message: "Expense retrieved successfully",
        expense,
      });
    } catch (error) {
      console.error("Error retrieving Expense:", error);
      res.status(500).json({ message: "Failed to retrieve Expense" });
    }
}



export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(expense);
  } catch (error) {
    handleError(res, error);
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
