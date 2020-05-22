import { SET_SCREAMS, LOADING_DATA,LIKE_SCREAM,UNLIKE_SCREAM,DELETE_SCREAM} from '../types';

const initialState={
    Screams:[],
    Scream:{},
    loading:false
};

export default function(state=initialState,action){
    switch(action.type){
        case SET_SCREAMS:
            return{
                ...state,
                Screams:action.payload,
                loading:false
            };
        case LIKE_SCREAM:
            case UNLIKE_SCREAM:
            let index=state.Screams.findIndex((s)=>s.id===action.payload.screamId);
            this.state.Screams[index]=action.payload;
            return {
                ...state
            };
        
        case DELETE_SCREAM:
             index=state.Screams.findIndex((s)=>s.id===action.payload);
            state.Screams.splice(index,1);
            return{
              ...state
            }; 
        case LOADING_DATA:
            return{
                ...state,
                loading:true
            }
        default:
            return state;
    }
}