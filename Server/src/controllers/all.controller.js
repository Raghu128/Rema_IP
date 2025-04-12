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
import nodemailer from "nodemailer";






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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    let isPasswordValid;
    // if (user.role === "admin") {
    //   isPasswordValid = password === process.env.ADMIN_PASSWORD;
    // } else {
      // }
        isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, name : user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Error during login" });
  }
}



export const checkSession = (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (error) {
    console.error("Error validating token:", error);

    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired"
        : "Invalid token";

    res.status(401).json({ message });
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

export const getfaculty = async (req, res) => {
  try {
    const users = await User.find({role : 'faculty'});
    res.status(200).json(users);
  } catch (error) {
    handleError(res, error);
  }
};


export const getStudentRelatedUsers = async (req, res) => {
  const { id } = req.params;
  const studentId = id;
  
  try {
    // 1. Get all supervisors of the student
    const supervisors = await Supervisor.find({ student_id: studentId }).select('faculty_id');
    const supervisorIds = supervisors.map(sup => sup.faculty_id.toString());

    // 2. Get all projects that include the student
    const projects = await Project.find({ team: studentId }).select('team');

    // 3. Extract all user IDs from project teams
    const teamMemberIds = new Set();
    projects.forEach(project => {
      project.team.forEach(userId => teamMemberIds.add(userId.toString()));
    });

    // 4. Combine supervisor IDs and team member IDs
    const userIds = new Set([...supervisorIds, ...teamMemberIds]);

    // 5. Fetch user info for these IDs
    const users = await User.find({ _id: { $in: Array.from(userIds) } })
      .select('_id name email role');

    // 6. Rename _id to id
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error('Error fetching related users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getUsersByFacultyId = async (req, res) => {
  const id = req.params.id;
  
  try {
    const users = await Supervisor.find({ faculty_id: id }).populate("student_id", "name email role");

    // Extract only the student_id field
    const students = users.map(user => user.student_id);

    res.status(200).json(students);
  } catch (error) {
    handleError(res, error);
  }
};



export const getUsersByid = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.find({ _id: id });

    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

// Nodemailer setup (Use your email credentials)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: `${process.env.YOUR_EMAIL}`,
    pass: `${process.env.YOUR_EMAIL_PASS}`,
  },
  port: process.env.EMAIL_PORT,
  secure: true,
});


export const updateUser = async (req, res) => {

  try {
    // Update user info
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });


    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Try sending an email
    try {
      await transporter.sendMail({
        from: process.env.YOUR_EMAIL,
        to: user.email,
        subject: "Important: Your Profile Information Has Been Modified by Admin",
        html: `
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>We are notifying you that your account details were recently modified by an administrator.</p>
            <p>If you authorized this change, no further action is required. However, if this update seems unexpected, please secure your account by resetting your password and contacting our support team.</p>
            
            <br/>
            <p>Best regards,</p>
            <p><strong>Rema Security Team</strong></p>
        `,
    });
    
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    // Send updated user response
    res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Error updating user:", error);
    handleError(res, error);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.params.id;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Track if we need to update the token
    let shouldUpdateToken = false;
    const updates = {};

    // Update name if provided
    if (name && name !== user.name) {
      user.name = name;
      updates.name = name;
      shouldUpdateToken = true;
    }

    // Handle password change if new password is provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password." });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }

      // Validate new password strength
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
      }

      // Hash and update new password
      user.password = await bcrypt.hash(newPassword, 10);
      shouldUpdateToken = true; // Password changes should trigger token update
    }

    // Save updated user
    const updatedUser = await user.save();

    // Generate new token if needed
    let newToken;
    if (shouldUpdateToken) {
      newToken = jwt.sign(
        { 
          id: updatedUser._id, 
          name: updatedUser.name, 
          email: updatedUser.email, 
          role: updatedUser.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set the new cookie
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Prepare response data
    const userData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    // Send notification email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: updatedUser.email,
        subject: "Your Profile Has Been Updated",
        html: `
          <p>Dear ${updatedUser.name},</p>
          <p>Your profile information has been successfully updated.</p>
          ${newPassword ? `<p><strong>Security Notice:</strong> Your password has been changed. If you didn't make this change, please contact support immediately.</p>` : ''}
          <br/>
          <p>Best regards,</p>
          <p>The ${process.env.APP_NAME} Team</p>
        `
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: userData,
      token: shouldUpdateToken ? newToken : undefined,
      tokenUpdated: shouldUpdateToken
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      message: "An error occurred while updating your profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    try {
      await transporter.sendMail({
        from: process.env.YOUR_EMAIL,
        to: user.email,
        subject: "Account Deletion Notification",
        html: `
            <p>Dear <strong>${user.name}</strong>,</p>
            
            <p>We regret to inform you that your account has been deleted by an administrator.</p>
            <p>If you believe this was a mistake or have any concerns, please contact our support team immediately.</p>
            
            <br/>
            <p>Best regards,</p>
            <p><strong>Rema Security Team</strong></p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred while deleting the user." });
  }
};



export async function handleUserSignup(req, res) {
  const { name, email, password, role } = req.body;
  const currentUser = req.user;

  try {
    if (currentUser.role === "faculty" && (role === "faculty" || role === "admin")) {
      return res.status(403).send("Faculty can only add students.");
    }
    if (currentUser.role !== "faculty" && currentUser.role !== "admin") {
      return res.status(403).send("Student cannot add anyone.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          createdAt: existingUser.createdAt
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // try {
    //   await transporter.sendMail({
    //     from: process.env.YOUR_EMAIL,
    //     to: user.email,
    //     subject: "Your Account Has Been Created - Action Required",
    //     html: `
    //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    //         <div style="text-align: center; margin-bottom: 20px;">
    //           <h1 style="color: #4361ee;">Welcome to Rema</h1>
    //         </div>
            
    //         <p>Dear <strong>${user.name}</strong>,</p>
            
    //         <p>Your account has been successfully created with the following details:</p>
            
    //         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
    //           <p><strong>Email:</strong> ${user.email}</p>
    //           <p><strong>Role:</strong> ${user.role}</p>
    //         </div>
            
    //        <p>For security reasons, you need to set your own password before accessing the system. Please use the 'Forgot Password' option during login to establish your new password.</p>
            
            
    //         <p style="color: #6c757d; font-size: 0.9em;">
    //           <strong>Note:</strong> This link will expire in 24 hours. If you didn't request this, please ignore this email.
    //         </p>
            
    //         <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6c757d;">
    //           <p>Best regards,</p>
    //           <p><strong>Rema Security Team</strong></p>
    //         </div>
    //       </div>
    //     `,
    //   });
    // } catch (emailError) {
    //   console.error("Error sending email:", emailError);
    // }

    return res.status(201).json({
      success: true,
      message: "User successfully created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("Error during signup");
  }
}



export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store token directly in the database
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Frontend reset link
    const resetLink = `${process.env.CORS_ORIGIN}/reset-password?token=${resetToken}`;

    // Attempt to send email
    try {
      await transporter.sendMail({
        from: process.env.YOUR_EMAIL,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      });

      res.json({ message: "Password reset email sent." });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      res.status(500).json({ message: "User found, but email could not be sent.", error: emailError.message });
    }

  } catch (error) {
    console.error("Error processing forgot password request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




// **Reset Password Controller**

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "Invalid token or user not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

















// GET Leave by ID
export const getLeaveByid = async (req, res) => {
  const id = req.params.id;
  try {

    // Using find() with an _id filter to match your user controller style
    const leave = await Leave.find({ user_id: id }).populate("faculty_id", "name");;
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


    const leaves = await Leave.find({ faculty_id: facultyId })
      .populate("user_id", "name email role");



    res.status(200).json(leaves);
  } catch (error) {
    handleError(res, error);
  }
};



export const fetchUsersOnLeaveCurrentMonth = async (req, res) => {
  try {
    const facultyId = req.params.facultyId || req.query.facultyId;

    if (!facultyId) {
      return res.status(400).json({ message: "facultyId is required" });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const leaves = await Leave.find({
      faculty_id: facultyId,
      status: 'approved',
      from: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    })
    .populate('user_id', 'name email')
    .sort({ from: 1 });
    

    const usersOnLeave = leaves.map(leave => ({
      user: leave.user_id,
      leave_id: leave._id,
      from: leave.from,
      to: leave.to,
      reason: leave.reason,
      days: Math.ceil((new Date(leave.to) - new Date(leave.from)) / (1000 * 60 * 60 * 24)) + 1
    }));

    res.status(200).json({
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      total_users_on_leave: usersOnLeave.length,
      users: usersOnLeave
    });

  } catch (error) {
    console.error('Error fetching users on leave:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users on leave',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, declined'
      });
    }

    // Update leave
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedLeave
    });

  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};



export const addLeave = async (req, res) => {
  try {
    const { faculty_id, user_id, from, to, reason } = req.body;

    // Create a new leave document with the provided data
    const newLeave = new Leave({ user_id, faculty_id, from, to, reason });
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
    const { faculty_id, student_id } = req.body;
    
    // Fetch faculty and student details
    const [faculty, student] = await Promise.all([
      User.findById(faculty_id),
      User.findById(student_id)
    ]);
    

    if (!faculty || !student) {
      return res.status(404).json({
        success: false,
        message: 'Faculty or student not found'
      });
    }

    // Check if this supervision relationship already exists
    const existingSupervision = await Supervisor.findOne({
      faculty_id,
      student_id
    });

    if (existingSupervision) {
      return res.status(409).json({
        success: false,
        message: 'This supervision relationship already exists'
      });
    }

    // Create the supervision record
    const supervisor = await Supervisor.create(req.body);

    try {
      // Send email to student
      await transporter.sendMail({
        from: process.env.YOUR_EMAIL,
        to: student.email,
        subject: `You've been added under ${faculty.name}'s supervision`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4361ee;">Supervision Assignment Notification</h2>
            </div>
            
            <p>Dear <strong>${student.name} </strong>,</p>
            
            <p>You have been added under the supervision of <strong>${faculty.name} (${faculty.email})</strong> with the following details:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Thesis Title:</strong> ${supervisor.thesis_title}</p>
              <p><strong>Joining Date:</strong> ${new Date(supervisor.joining).toDateString()}</p>
              ${supervisor.stipend > 0 ? `<p><strong>Stipend:</strong> ₹${supervisor.stipend}</p>` : ''}
            </div>
            
            <p>Please contact your supervisor for further guidance and next steps.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6c757d;">
              <p>Best regards,</p>
              <p><strong>Research Management Team</strong></p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Supervision record created successfully',
      data: supervisor
    });

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
    
    // Get all supervisors matching the faculty_id
    const supervisors = await Supervisor.find({ faculty_id: id })
      .populate("faculty_id", "name role email")
      .populate("student_id", "name role email")
      .populate("committee", "name role email");

    if (!supervisors || supervisors.length === 0) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    // Process each supervisor document
    const result = await Promise.all(supervisors.map(async (supervisor) => {
      // Convert to plain object
      const supervisorObj = supervisor.toObject();
      
      // Handle student_id - ensure it's treated as a single object
      let student = supervisorObj.student_id;
      
      // If student_id is an array, take the first one
      if (Array.isArray(student)) {
        student = student[0];
        supervisorObj.student_id = student; // Update to single object
      }

      const studentId = student?._id;

      // Find projects where:
      // 1. Student is in team or is lead author
      // 2. AND the project's faculty_id matches the requested faculty ID
      const studentProjects = studentId ? await Project.find({
        $and: [
          {
            $or: [
              { team: studentId },
              { lead_author: studentId }
            ]
          },
          { faculty_id: id } // Only projects for this faculty member
        ]
      })
      .populate('team', 'name email')
      .populate('lead_author', 'name email')
      .populate('faculty_id', 'name email') : [];

      // Attach projects to the student object
      if (student) {
        student.projects = studentProjects || [];
      }

      return supervisorObj;
    }));

    // Always return an array, even if there's only one supervisor
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching supervisor:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
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

    if (!project) {
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

    if (!project) {
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

// MinutesOfMeeting functions
export const createMinutesOfMeeting = async (req, res) => {
  try {
    const { pid, added_by } = req.body;
    
    // Create the new message
    const minutes = await MinutesOfMeeting.create(req.body);
    
    // Update the project's lastViewedNotes for the creator
    const updatedProject = await Project.findByIdAndUpdate(
      pid,
      { 
        $set: { 
          lastViewedNotes: { 
            [added_by]: new Date()  // Only this user will remain
          } 
        } 
      },
      { new: true }
    );
    
    // Populate the added_by field
    const populatedMinutes = await MinutesOfMeeting.findById(minutes._id)
      .populate('added_by', 'name');
    
    // Emit socket events if available
    if (req.io) {
      // 1. Notify about the new message
      req.io.to(pid.toString()).emit('new_message', populatedMinutes);
      
      // 2. Notify about the project update (for project refresh)
      req.io.to(pid.toString()).emit('project_updated');
      
    } else {
      console.error('Socket.IO instance not available');
    }
    
    res.status(201).json(populatedMinutes);
  } catch (error) {
    handleError(res, error);
  }
};
// routes/projectRoutes.js
export const getNewNotesCount = async (req, res) => {
  try {
    const projects = await Project.find({ faculty_id: req.params.id });
    const counts = {};
    
    await Promise.all(projects.map(async project => {
      const count = await MinutesOfMeeting.countDocuments({
        pid: project._id,
        createdAt: { $gt: project.lastViewedNotes }
      });
      counts[project._id] = count;
    }));
    
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMinutesOfMeetingById = async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.id; // Assuming user ID is available in req.user

  try {
    // Update lastViewedNotes for this user and project
    
    if (userId) {
      await Project.findByIdAndUpdate(
        id,
        { $set: { [`lastViewedNotes.${userId}`]: new Date() } },
        { new: true }
      );
    }
    

    // Find and populate meeting notes
    const meeting = await MinutesOfMeeting.find({ pid: id })
      .populate('added_by', 'name');

    if (!meeting || meeting.length === 0) {
      return res.status(404).json({ message: 'Minutes of Meeting not found' });
    }

    // Socket.IO emission for POST requests
    if (req.method === 'POST' && req.io) {
      req.io.to(id).emit('new_message', meeting[meeting.length - 1]);
    }

    res.json(meeting);
  } catch (error) {
    console.error('Error:', error);
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

    if (!notification) {
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
    let { funding_by_srp_id, amount, name, date_of_purchase } = req.body;

    // Validate required fields
    if (!amount || !name) {
      return res.status(400).json({ message: "Missing required fields: amount or name." });
    }

    // Ensure funding_by_srp_id is a valid ObjectId or null
    if (!funding_by_srp_id || funding_by_srp_id.trim() === "") {
      funding_by_srp_id = null; // Set it to null if empty
    }

    // Create the equipment
    const equipment = new Equipment({ ...req.body, funding_by_srp_id });
    await equipment.save();

    res.status(201).json({ message: "Equipment created successfully.", equipment });
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
    const equipment = await Equipment.find({ ownership: id }).populate([
      { path: "usingUser", select: "name email" },
      { path: "funding_by_srp_id", select: "agency" }
    ]);
    

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
    const equipment = await Equipment.find({ usingUser: id }).populate("ownership", "name");

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

    // Ensure funding_by_srp_id is a valid ObjectId or null
    if (req.body.funding_by_srp_id === "" || !req.body.funding_by_srp_id) {
      req.body.funding_by_srp_id = null;
    }

    // Update the equipment details
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      req.body,
      { new: true, runValidators: true } // Ensure validation rules are applied
    );

    res.status(200).json({ message: "Equipment updated successfully", updatedEquipment });
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ message: "Failed to update equipment", error: error.message });
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
    // const budget = await FinanceBudget.findOne({ srp_id });

    // if (!budget) {
    //   return res.status(404).json({ message: "Finance budget not found." });
    // }


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

    if (!sponsorProjects) {
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
