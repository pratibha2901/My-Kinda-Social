import { SET_SCREAMS, LOADING_DATA,LIKE_SCREAM,UNLIKE_SCREAM,DELETE_SCREAM} from '../types';
import axios from 'axios'; 

//action to get all screams
export const getScreams=()=>(dispatch)=>{
    dispatch({type:LOADING_DATA});
    axios.get('/Screams')
    .then((res)=>{
        dispatch({
            type:SET_SCREAMS,
            payload:res.data
        })
    })
    .catch(err=>{
        dispatch({
            type:SET_SCREAMS,
            payload:[]
        });
    })
    
};

//action to get like a scream
export const likeScream=(screamId)=>(dispatch)=>{
    
    axios.get(`/Scream/${screamId}/like`)
    .then((res)=>{
        dispatch({
            type:LIKE_SCREAM,
            payload:res.data
        })
    })
    .catch(err=>{
        console.log(err);
    })
    
};

//action to get unlike a scream
export const unlikeScream=(screamId)=>(dispatch)=>
{
    
    axios.get(`/Scream/${screamId}/unlike`)
    .then((res)=>{
        dispatch({
            type:UNLIKE_SCREAM,
            payload:res.data
        })
    })
    .catch(err=>{
        console.log(err);
    })
    
};
export const deleteScream=(screamId)=>(dispatch)=>{
    axios.delete(`/Scream/${screamId}`)
    .then(()=>{
        dispatch({type:DELETE_SCREAM,payload:screamId});
    })
    .catch(err=>{
        console.log(err);
    })

}