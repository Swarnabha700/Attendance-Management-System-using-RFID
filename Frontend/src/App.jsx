import Navbar from "./components/Navbar"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Attendance from "./pages/Attendance"
import Registration from "./pages/Registration"
import Report from "./pages/Report"
import DashBoard from "./pages/DashBoard"
import AttendanceReport from "./pages/AttendanceReport"

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Attendance />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/attendance" element={<AttendanceReport />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
