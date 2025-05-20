import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import PoliticianDetails from "./pages/PoliticianDetails";
import Politicians from "./pages/Politicians";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPoliticiansList from "./pages/Admin/AdminPoliticiansList";
import AdminPoliticianForm from "./pages/Admin/AdminPoliticianForm";
import AdminPoliticianDetail from "./pages/Admin/AdminPoliticianDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/search-politician/" element={<Politicians />} />
        <Route path="/politicians/:slug" element={<PoliticianDetails />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/politicians"
          element={
            <PrivateRoute>
              <AdminPoliticiansList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/politicians/new"
          element={
            <PrivateRoute>
              <AdminPoliticianForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/politicians/:slug/view"
          element={
            <PrivateRoute>
              <AdminPoliticianDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/politicians/:slug/edit"
          element={
            <PrivateRoute>
              <AdminPoliticianForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
