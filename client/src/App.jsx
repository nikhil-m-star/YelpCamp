import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import CampgroundIndex from './pages/CampgroundIndex';
import CampgroundShow from './pages/CampgroundShow';
import CampgroundNew from './pages/CampgroundNew';
function App(){
  return(
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <Navbar/>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<h1 className="text-4xl font-bold">Welcome to YelpCamp</h1>} />
            <Route path="/campgrounds" element={<CampgroundIndex/>} />
            <Route path="/campgrounds/new" element={<CampgroundNew/>}/>

            <Route path="/campgrounds/:id" element={<CampgroundShow/>}/>
          </Routes>
        </main>
        </div>    
        
        </Router>
  )
}
export default App