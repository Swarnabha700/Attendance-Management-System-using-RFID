import Navbar from "./components/Navbar"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Attendance from "./pages/Attendance"
import Registration from "./pages/Registration"
import Report from "./pages/Report"
import DashBoard from "./pages/DashBoard"

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Attendance />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
