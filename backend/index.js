const express = require("express");
const path = require("path");
const app = express();
const configDotenv = require('dotenv');
const cors = require('cors');
const ConnectDB = require('./db/connect.js');

//Static API import
const testing = require('./APIs/test.json');

// Course Router Import
const courseRoutes = require('./router/course.router.js');

// Contact router Import
const contactRouter = require('./router/contact.router.js');

// Review router Import
const reviewRouter = require('./router/review.router.js');


const teacherRouter = require('./router/teacher.router.js');

// Note and Exam router Imports
const noteRouter = require('./router/note.router.js');
const examRouter = require('./router/exam.router.js');
const batchRouter = require('./router/batch.router.js');
const attendanceRouter = require('./router/attendance.router.js');
const statsRouter = require('./router/stats.router.js');
const accessLogRouter = require('./router/accessLog.router.js');
const notificationRouter = require('./router/notification.router.js');
// Auth router Import
const authRouter = require('./router/auth.router.js');

// Config env
configDotenv.config();

// CORS error
app.use(cors());

// Trust Proxy
app.set("trust proxy", 1);

// Body parser
app.use(express.json());

// Serve uploaded files (PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// static API Data
app.get('/api/coaching', (req, res) => {
    res.json(testing);
});

// Routers
app.use("/api", courseRoutes);
app.use("/api", contactRouter);
app.use("/api", reviewRouter);
app.use("/api", teacherRouter);
app.use("/api", noteRouter);
app.use("/api", examRouter);
app.use("/api", batchRouter);
app.use("/api", attendanceRouter);
app.use("/api", statsRouter);
app.use("/api", accessLogRouter);
app.use("/api", notificationRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 9000;

// Mongodb Call and Server Listen
ConnectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Mongodb connection failed !!!!", error);
    });