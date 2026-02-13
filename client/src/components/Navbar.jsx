import {Link} from 'react-router-dom';

export default function Navbar(){
    return(
        <nav className="bg-slate-800 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">YelpCamp</Link>
                <div className='space-x-6'>
                    <Link to="/campgrounds" className="hover:text-blue-400 transition">All Campgrounds</Link>
                    <Link to="/campgrounds/new" className="hover:text-blue-400 transition font-semibold">New Campground</Link>
                </div>
            </div>
        </nav>
    )
}