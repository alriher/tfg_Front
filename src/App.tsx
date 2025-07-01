import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./components/Navbar";
import Spaces from "./views/Spaces";
import Login from "./views/Login";
import { NextUIProvider } from "@nextui-org/react";
import SpaceDetails from "./views/SpaceDetails";
import Register from "./views/Register";
import Bookings from "./views/Bookings";
import Profile from "./views/Profile";
import AdminUsers from "./views/AdminUsers";
import AdminSpaces from "./views/AdminSpaces";
import AdminUserBookings from "./views/AdminUserBookings";
import { RequireAdmin } from "./services/AdminServices";
import { RequireSpaceAdmin, RequireSpaceAdminOrAdmin } from "./services/AdminSpaceServices";
import CreateSpace from "./views/CreateSpace";
import MySpaces from "./views/MySpaces";
import AdminUserSpaces from "./views/AdminUserSpaces";
import SpaceBookingsDetails from "./views/SpaceBookingsDetails";
import Contacto from "./views/Contacto";

function App() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate} locale="es-ES">
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Spaces />} />
        <Route path="/communities" element={<Spaces />} />
        <Route path="/contact" element={<Contacto />} />
        <Route path="/spaces/:id" element={<SpaceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminUsers />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/spaces"
          element={
            <RequireAdmin>
              <AdminSpaces />
            </RequireAdmin>
          }
        />
        <Route
          path="admin/users/:userId/spaces"
          element={
            <RequireAdmin>
              <AdminUserSpaces />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users/:userId/bookings"
          element={
            <RequireAdmin>
              <AdminUserBookings />
            </RequireAdmin>
          }
        />
        <Route
          path="/space-admin/create-space"
          element={
            <RequireSpaceAdmin>
              <CreateSpace />
            </RequireSpaceAdmin>
          }
        />
        <Route
          path="/space-admin/my-spaces"
          element={
            <RequireSpaceAdmin>
              <MySpaces />
            </RequireSpaceAdmin>
          }
        />
        <Route
          path="/space-admin/space-bookings"
          element={
            <RequireSpaceAdmin>
              <MySpaces />
            </RequireSpaceAdmin>
          }
        />
        <Route
          path="/spaces/:spaceId/bookings"
          element={
            <RequireSpaceAdminOrAdmin>
              <SpaceBookingsDetails />
            </RequireSpaceAdminOrAdmin>
          }
        />
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
