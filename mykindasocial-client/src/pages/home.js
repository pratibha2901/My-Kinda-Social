import React ,{ Component } from 'react';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';
import PropTypes from 'prop-types';
import Scream from  '../components/Scream';
import Profile from '../components/Profile';
//redux
import {connect} from 'react-redux';
import { getScreams} from '../redux/actions/dataActions';


class home extends Component
{
   
    render()
    {
        const { Screams,loading}=this.props.data;

        let recentScreamMarkup=!loading?(Screams.map((s)=><Scream key={s.id} Scream={s} />)):(<p>still loading.....</p>);
        return(
           <Grid container spacing={9}>
               <Grid item sm={8} xs={12}>
                   {recentScreamMarkup}
               </Grid>
             
           
           <Grid item sm={4} xs={12}>
              <Profile/>
           </Grid>
       </Grid>
        )
    }
    componentDidMount()
    {
       this.props.getScreams();
    }
}
home.propTypes={
    getScreams:PropTypes.func.isRequired,
    data:PropTypes.object.isRequired

}
const mapStateToProps=(state)=>({
    data:state.data
});
export default connect(mapStateToProps,{getScreams})(home)