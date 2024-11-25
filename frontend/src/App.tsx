import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Books from './components/Books';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import { UserProvider } from "./context/UserContext";
import EditUser from './components/EditUser';
import EditPassword from './components/EditPassword';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/edit-user" element={<EditUser />} />
          <Route path="/edit-password" element={<EditPassword />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
