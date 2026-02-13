import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CampgroundNew(){
    const [title,setTitle] = useState('');
    const [location,setLocation] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const newCamp = {campground : {title,location}};
        const res = await axios.post('http://localhost:3000/campgrounds',newCamp);
        navigate(`/campgrounds/${res.data._id}`);

    };
    return(
        <div>
            <h1>New Campground</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" value = {title} onChange={(e)=>setTitle(e.target.value)} />

                </div>
                <div>
                    <label>Location</label>
                    <input type="text" value = {location} onChange = {(e)=>{setLocation(e.target.value)}} />
                </div>
                <button type="submit">Add Campground</button>
            </form>
        </div>
    )
}