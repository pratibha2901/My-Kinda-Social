import React ,{ Component } from 'react';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';
import Scream from  '../components/Scream';
import Profile from '../components/Profile';


class home extends Component
{
    state={
        Screams:null
    }
    render()
    {

        let recentScreamMarkup=this.state.Screams?(this.state.Screams.map((s)=><Scream key={s.id} Scream={s} />)):(<p>still loading.....</p>);
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
        axios.get('/Screams')
        .then(res=>{
            console.log(res.data);
            this.setState({
                Screams:res.data
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }
}
export default home