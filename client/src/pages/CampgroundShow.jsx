import {useState,useEffect} from 'react';
import {useParams,Link} from 'react-router-dom';
import axios from 'axios';

export default function CampgroundShow(){
    const {id} = useParams();
    const [campground,setCampground] = useState(null);
    useEffect(()=>{const fetchCamp = async ()=>{
        const res = await axios.get(`http://localhost:3000/campgrounds/${id}`);
        setCampground(res.data);
    };
    fetchCamp();
    },[id]);
    if(!campground) return(<div className="p-10 text-center">Loading...</div>);
    return(
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8">
                <h1 className="text-4xl font-extrabold text-slate-800">{campground.title}</h1>
                <p className="text-xl text-slate-500 mt-2 font-medium">{campground.location}</p>
                <p className="mt-6 text-slate-600 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Quisquam, voluptatum. (We will add descriptions later!)
                </p>
                <div className="mt-8 flex gap-4">
                    <Link to={`/campgrounds`} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition">
                        Back to All</Link>
                </div>
            </div>
        </div>
    )


}