import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './views/Home'
import NavbarComponent from './components/Navbar'

function App() {
  return (
    <>
      <BrowserRouter>
      <NavbarComponent />
      <Routes>
          <Route path="/" element={<Home />} /> {/*Comprobar si el usuario esta logeado */}
          <Route path="/home" element={<Home />} />



          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/token" element={<RequireAuth><TokenPage /></RequireAuth>} />
          <Route path="/bookings" element={<RequireAuth><BookingsPage /></RequireAuth>} />
          <Route path="/bookings/:id" element={<RequireAuth><BookingDetailPage /></RequireAuth>} />
          <Route path="/spaces" element={<RequireAuth><SpacesPage /></RequireAuth>} />
          <Route path="/spaces/:id" element={<RequireAuth><SpaceDetailPage /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><UsersPage /></RequireAuth>} />
          <Route path="/users/:id" element={<RequireAuth><UserDetailPage /></RequireAuth>} /> */}
      </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
