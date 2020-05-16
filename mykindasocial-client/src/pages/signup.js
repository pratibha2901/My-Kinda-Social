import React ,{ Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import  AppIcon from '../images/butterfly-2.jpg';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

//MUI stuffs
import Grid from '@material-ui/core/Grid';

const styles =({
    
    form:{
      textAlign:'center'
     },
     image:{
         margin:'20px auto 20px auto',
         maxWidth:200,
         minWidth:200
     },
     textField:{
         margin:'10px auto 10px auto',
 
     },
     pageTitle:{
         margin:'10px auto 10px auto',
 
     },
     button:{
         marginTop:20,
         marginBottom:20,
         position:'relative'
     },
     customError:{
         color:'red',
         fontSize:'0.8rem',
         marginTop:10
     },
     progress:{
         position:'absolute'
         
     }
    
     
     
     });



class signup extends Component{

handleSubmit = (event)  =>
{
    event.preventDefault();
    this.setState({
        loading:true
    });
    const newUserData={
        email:this.state.email,
        password:this.state.password,
        confirmPassword:this.state.confirmPassword,
        handle:this.state.handle
    };
    axios.post('/signup',newUserData)
    .then(res=>{
        console.log(res.data);
        localStorage.setItem('FBIdToken',`Bearer ${res.data.token}`);
        this.setState({
            loading:false
        });
        this.props.history.push('/');
    })
    .catch(err=>
        {
            
            this.setState({
                errors:err.response.data.errors? err.response.data.errors: err.response.data,
                loading:false
                
            })

        });

};


handleChange= (event) =>{
  this.setState({
      [event.target.name]:event.target.value
  });
};


 constructor(){
     super();
     this.state={
         email:'',
         password:'',
         confirmPassword:'',
         handle:'',
         loading:false,
         errors:{}


     }
 }
   
render(){
    
        const { classes }=this.props;
        const { errors,loading }=this.state;
        return(
            <Grid container className={classes.form}>
                   <Grid item sm/>
                   <Grid item sm>
                       <img src={AppIcon} alt="Social" className={classes.image}/>
        <Typography variant="h2" className={classes.pageTitle}>Signup</Typography>
        <form noValidate 
        onSubmit={this.handleSubmit}> 
           <TextField
            id="email"
             name="email"
              type="email"
               label="Email"
               helperText={ errors.email }
               error={errors.email ? true : false }
               value={this.state.email}
               onChange={this.handleChange}
                className={classes.textField}
           
            fullWidth>

           </TextField>
              
           <TextField 
           id="password" 
           name="password"
            type="password" 
            label="Password"
            helperText={errors.password}
               error={errors.password? true : false} 
            className={classes.textField}
           value={this.state.password} 
           onChange={this.handleChange} fullWidth>

           </TextField>
           <TextField
            id="confirmPassword"
             name="confirmPassword"
              type="password"
               label="Confirm Password"
               helperText={ errors.confirmPassword }
               error={errors.confirmPassword ? true : false }
               value={this.state.confirmPassword}
               onChange={this.handleChange}
                className={classes.textField}
           
            fullWidth>

           </TextField>
           <TextField
            id="handle"
             name="handle"
              type="text"
               label="Handle"
               helperText={ errors.handle }
               error={errors.handle ? true : false }
               value={this.state.handle}
               onChange={this.handleChange}
                className={classes.textField}
           
            fullWidth>

           </TextField>
           {errors.general && (
               <Typography variant="body2" className={classes.customError}>
                   {errors.general}
               </Typography>
           )}
           <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>Signup
           {loading &&(
               <CircularProgress className={classes.progress} size={20}/>
           )}
           </Button> 
           <br/>
           <small>Already have an account ?<Link to="/login">login here</Link></small>
        </form>
        
        </Grid>
                   
        <Grid item sm/>
            </Grid>
        )
    }
}
signup.propTypes={
    classes:PropTypes.object.isRequired
}
export default withStyles(styles)(signup);


