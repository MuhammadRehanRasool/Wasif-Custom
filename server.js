const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const usersRoute = require("./routes/usersRoute");
const labsRoute = require("./routes/labsRoute");
const leaveRequestRoute = require("./routes/leaveRequestRoute");
const staffAttendanceRoute = require("./routes/staffAttendanceRoute");
const teacherAttendanceRoute = require("./routes/teacherAttendanceRoute");
const timetableRoute = require("./routes/timetableRoute");
const dailyEquipmentReportRoute = require("./routes/dailyEquipmentReportRoute");
const bookLabRoute = require("./routes/bookLabRoute");
const categoriesRoute = require("./routes/categoriesRoute");
const testRoute = require("./routes/testRoute");

const cors = require("cors");
const port = process.env.PORT || 4000;


dotenv.config();
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.vqtqm.mongodb.net/cluster0?retryWrites=true&w=majority",
  {},
  () => {
    console.log("Database connected...");
  }
);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use("/users", usersRoute);
app.use("/labs", labsRoute);
app.use("/leaveRequest", leaveRequestRoute);
app.use("/staffAttendance", staffAttendanceRoute);
app.use("/teacherAttendance", teacherAttendanceRoute);
app.use("/timetable", timetableRoute);
app.use("/dailyEquipmentReport", dailyEquipmentReportRoute);
app.use("/bookLab", bookLabRoute);
app.use("/categories", categoriesRoute);
app.use("/welcome", testRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  // res.send("Backend!");
});

app.listen(port, () => {
  console.log("Backend is running....");
});
