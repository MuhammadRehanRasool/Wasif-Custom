import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./views/Login";
import Layout from "./views/Layout";
import AddUser from "./views/AddUser";
import ViewUsers from "./views/ViewUsers";
import AddLab from "./views/AddLab";
import ViewLabs from "./views/ViewLabs";
import StaffAttendance from "./views/StaffAttendance";
import ViewStaffAttendance from "./views/ViewStaffAttendance";
import AddTimetable from "./views/AddTimetable";
import ViewTimetable from "./views/ViewTimetable";
import AddLeaveRequest from "./views/AddLeaveRequest";
import TeacherAttendance from "./views/TeacherAttendance";
import ViewTeacherAttendance from "./views/ViewTeacherAttendance";
import ReviewTeacherAttendance from "./views/ReviewTeacherAttendance";


function App(props) {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Layout />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/addUser"
            element={
              <Layout>
                <AddUser />
              </Layout>
            }
          />
          <Route
            path="/viewUsers"
            element={
              <Layout>
                <ViewUsers />
              </Layout>
            }
          />
          <Route
            path="/addLab"
            element={
              <Layout>
                <AddLab />
              </Layout>
            }
          />
          <Route
            path="/viewLabs"
            element={
              <Layout>
                <ViewLabs />
              </Layout>
            }
          />

          <Route
            path="/staffAttendance"
            element={
              <Layout>
                <StaffAttendance />
              </Layout>
            }
          />

          <Route
            path="viewStaffAttendance"
            element={
              <Layout>
                <ViewStaffAttendance />
              </Layout>
            }
          />

          <Route
            path="/addTimetable"
            element={
              <Layout>
                <AddTimetable type="add" />
              </Layout>
            }
          />
          
          <Route
            path="/editTimetable/*"
            element={
              <Layout>
                <AddTimetable type="edit"/>
              </Layout>
            }
          />

          <Route
            path="/viewTimetables"
            element={
              <Layout>
                <ViewTimetable />
              </Layout>
            }
          />

          <Route
            path="/addLeaveRequest"
            element={
              <Layout>
                <AddLeaveRequest />
              </Layout>
            }
          />

          <Route
            path="/teacherAttendance"
            element={
              <Layout>
                <TeacherAttendance />
              </Layout>
            }
          />

          <Route
            path="/viewTeacherAttendance"
            element={
              <Layout>
                <ViewTeacherAttendance />
              </Layout>
            }
          />

          <Route
            path="/reviewTeacherAttendance"
            element={
              <Layout>
                <ReviewTeacherAttendance />
              </Layout>
            }
          />

          <Route path="*" element={<Layout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
