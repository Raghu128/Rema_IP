import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


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

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/sponsor-projects", sponsorProjectRouter);
app.use("/api/v1/supervisors", supervisorRouter);
app.use("/api/v1/projects", projectRouter); 
app.use("/api/v1/minutes-of-meeting", minutesOfMeetingRouter);
app.use("/api/v1/venues", venueListRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/equipment", equipmentRouter);
// app.use("/api/v1/finance-budgets", financeBudgetRouter);
// app.use("/api/v1/expenses", expenseRouter);



export { app }