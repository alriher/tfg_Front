import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import NavbarComponent from "./components/Navbar";
import Communities from "./views/Communities";
import Login from "./views/Login";
import { NextUIProvider } from "@nextui-org/react";
import SpaceDetails from "./views/SpaceDetails";
import Register from "./views/Register";
import Bookings from "./views/Bookings";

function App() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate} locale="es-ES">
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/spaces/:id" element={<SpaceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </NextUIProvider>
  );
}

export default App;

/* 
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/token" element={<RequireAuth><TokenPage /></RequireAuth>} />
          <Route path="/bookings" element={<RequireAuth><BookingsPage /></RequireAuth>} />
          <Route path="/bookings/:id" element={<RequireAuth><BookingDetailPage /></RequireAuth>} />
          <Route path="/spaces" element={<RequireAuth><SpacesPage /></RequireAuth>} />
          <Route path="/spaces/:id" element={<RequireAuth><SpaceDetailPage /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><UsersPage /></RequireAuth>} />
          <Route path="/users/:id" element={<RequireAuth><UserDetailPage /></RequireAuth>} /> */
