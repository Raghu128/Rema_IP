import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN, // Your Vite frontend URL
      methods: ["GET", "POST"],
      credentials: true // This is crucial
    }
  });

// Socket.IO connection handler
io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id)
  
  // Join a room based on project ID
  socket.on('join_project', (projectId) => {
    socket.join(projectId)
    // console.log(`User ${socket.id} joined project ${projectId}`)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})


// Importing Routers
import userRouter from './routes/user.routes.js';
import sponsorProjectRouter from './routes/sponsorProject.routes.js';
import supervisorRouter from './routes/supervisor.routes.js';
import projectRouter from './routes/project.routes.js';
import minutesOfMeetingRouter from './routes/minutesOfMeeting.routes.js';
import venueListRouter from './routes/venueList.routes.js';
import notificationRouter from './routes/notification.routes.js';
import equipmentRouter from './routes/equipment.routes.js';
import financeBudgetRouter from './routes/financeBudget.routes.js';
import expenseRouter from './routes/expense.routes.js';
import leaveRoutes from "./routes/leave.routes.js";

import { getUsersByid, handleUserLogout } from "./controllers/all.controller.js"

// Routes declaration
app.get("/api/v1/userbyid/:id", getUsersByid);
app.post("/api/v1/logout", handleUserLogout);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/sponsor-projects", sponsorProjectRouter);
app.use("/api/v1/supervisors", supervisorRouter);
app.use("/api/v1/projects", projectRouter);  
app.use("/api/v1/minutes-of-meeting", minutesOfMeetingRouter(io));
app.use("/api/v1/venues", venueListRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/equipment", equipmentRouter);
app.use("/api/v1/finance-budgets", financeBudgetRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/leaves", leaveRoutes);



app.get("/", (req, res) => {
    res.status(200).send("Updated backend 4 march 2025 3:52");
});



export { app, httpServer, io }