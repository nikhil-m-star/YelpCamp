import {useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default function CampgroundIndex(){
    const[campgrounds,setCampgrounds] = useState([]);
    useEffect(()=>{
        const fetchCampgrounds = async()=>{
            try{
                const res = await axios.get('http://localhost:3000/campgrounds');
                setCampgrounds(res.data);
            }
            catch(e){
                console.error("Error fetching data",e);
            }
        }
        fetchCampgrounds();
    },[]);
    return(
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 border-b pb-4">All Campgrounds</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campgrounds.map(camp=>(
                    <div key = {camp._id} className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition'>
                        <div className="p-6">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {camp.title}
                            </h2>
                            <p className="text-slate-500 mt-2">
                                {camp.location}
                            </p>
                            <Link to={`/campgrounds/${camp._id}`}  className="inline-block mt-4 text-blue-500 font-semibold hover:text-blue-700 underline decoration-2 underline-offset-4"
              >
                View Details
              </Link>
              </div>
                     </div>   
                ))}
            </div>
        </div>
    )
}