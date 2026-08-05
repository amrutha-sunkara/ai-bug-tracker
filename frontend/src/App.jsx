import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import { ThemeContext } from "./context/ThemeContext";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ViewProjects from "./pages/ViewProjects";

import ReportBug from "./pages/ReportBug";
import ViewBugs from "./pages/ViewBugs";

import ProjectDetails from "./pages/ProjectDetails";

import ProtectedRoute from "./components/ProtectedRoute";



function App() {


const {darkMode}=useContext(ThemeContext);



return (


<div className={darkMode ? "dark" : ""}>


<div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white">


<BrowserRouter>


<Routes>


{/* Public Routes */}


<Route

path="/"

element={<Home />}

/>



<Route

path="/login"

element={<Login />}

/>



<Route

path="/register"

element={<Register />}

/>





{/* Protected Routes */}



<Route

path="/dashboard"

element={

<ProtectedRoute>

<Dashboard />

</ProtectedRoute>

}

/>






<Route

path="/create-project"

element={

<ProtectedRoute>

<CreateProject />

</ProtectedRoute>

}

/>






<Route

path="/view-projects"

element={

<ProtectedRoute>

<ViewProjects />

</ProtectedRoute>

}

/>







<Route

path="/report-bug"

element={

<ProtectedRoute>

<ReportBug />

</ProtectedRoute>

}

/>







<Route

path="/view-bugs"

element={

<ProtectedRoute>

<ViewBugs />

</ProtectedRoute>

}

/>








<Route

path="/project/:id"

element={

<ProtectedRoute>

<ProjectDetails />

</ProtectedRoute>

}

/>






</Routes>


</BrowserRouter>


</div>


</div>


);


}


export default App;