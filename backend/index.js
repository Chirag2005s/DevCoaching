const express = require("express");
const app = express();
const configDotenv = require('dotenv');
const cors = require('cors')
const ConnectDB = require('./db/connect.js');

//Static API import
const testing = require('./APIs/test.json');


// Course Router Import
const courseRoutes = require('./router/course.router.js');
const Course = require('./router/course.router.js');
const deleteCourse = require('./router/course.router.js');


// Contact router Import
const contactRouter = require('./router/contact.router.js');
const getContactRouter = require('./router/contact.router.js');


// CORS error
app.use(cors());

configDotenv.config({
    path: './env'
})

// Mongodb Call
ConnectDB()
    .then(() => {
        app.listen(9000, () => {
            console.log(`Server is running at port: 9000`);
        })
    })
    .catch((error) => {
        console.log("Mongodb connection faild !!!!", error)
    })





// app.use(express.json());



// static API Data
app.get('/api/coaching', (req, res) => {
    res.json(testing);
});


// Routers

// Course Routers
app.use("/api", courseRoutes);
app.use("/api", Course);
app.use("/api", deleteCourse);

// Contact Routers
app.use("/api", contactRouter);
app.use("/api", getContactRouter)

PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server run port at ${PORT}`);
})