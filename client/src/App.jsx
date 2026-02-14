import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import CampgroundIndex from './pages/CampgroundIndex';
import CampgroundShow from './pages/CampgroundShow';
import CampgroundNew from './pages/CampgroundNew';
import CampgroundEdit from './pages/CampgroundEdit';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campgrounds" element={
            <main className="page-wrapper container">
              <CampgroundIndex />
            </main>
          } />
          <Route path="/campgrounds/new" element={
            <main className="page-wrapper">
              <CampgroundNew />
            </main>
          } />
          <Route path="/campgrounds/:id/edit" element={
            <main className="page-wrapper">
              <CampgroundEdit />
            </main>
          } />
          <Route path="/campgrounds/:id" element={
            <main className="page-wrapper">
              <CampgroundShow />
            </main>
          } />
          <Route path="/login" element={
            <main className="page-wrapper">
              <Login />
            </main>
          } />
          <Route path="/register" element={
            <main className="page-wrapper">
              <Register />
            </main>
          } />
        </Routes>
      </div>
    </Router>
  )
}
export default App