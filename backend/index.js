const express = require("express");
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

// Config env
configDotenv.config();

// CORS error
app.use(cors());

// Body parser
app.use(express.json());

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