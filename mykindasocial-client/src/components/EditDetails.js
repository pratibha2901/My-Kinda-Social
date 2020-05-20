
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import themeFile from '../util/theme';

//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ToolTip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton  from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';


//MUI Icons
import EditIcon from '@material-ui/icons/Edit';

//redux stuffs
import {connect} from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions';

//style and themes
//const theme = createMuiTheme(themeFile);
const style={
    
    button:{
        
        float:'right'
    },
    textField:{
        margin:'10px auto 10px auto',

    }
};


export class EditDetails extends Component {
    state={
        bio:'',
        website:'',
        location:'',
        open:false
    };
    
    mapUserDetailsToState=(credentials)=>{
        this.setState({
            bio:credentials.bio?credentials.bio:'',
            website:credentials.website?credentials.website:'',
            location:credentials.location?credentials.location:''
        });
    };
    handleProfileDetailsOpen=()=>{
        this.setState({
            open:true
        });
        this.mapUserDetailsToState(this.props.credentials);

    };
    handleProfileDetailsClose=()=>{
        this.setState({
            open:false
        });
        this.mapUserDetailsToState(this.props.credentials);

    };
    onChange= (event) =>{
        this.setState({
            [event.target.name]:event.target.value
        });
      };
      handleSubmit=()=>{
          const userDetails={
              bio:this.state.bio,
              website:this.state.website,
              location:this.state.location
          };
          this.props.editUserDetails(userDetails);
          this.handleProfileDetailsClose();
      }
   
    componentDidMount(){
        const { credentials }=this.props;
        this.mapUserDetailsToState(credentials);

    }
   
    render() {
        const {classes}=this.props;
        return (
           <Fragment>
             <ToolTip title="Edit profile details">
             <IconButton onClick={this.handleProfileDetailsOpen} classes={classes.button} >
                 <EditIcon color="primary"/>
             </IconButton>
             </ToolTip>
           <Dialog 
           open={this.state.open} 
           onClose={this.handleProfileDetailsClose}
           fullWidth
           maxWidth="sm">
               <DialogTitle></DialogTitle>
               <DialogContent>
               <form>
                   <TextField type="text" 
                   name="bio" 
                   label = "Bio"
                   multiline
                   rows="3"
                   placeholder=""
                   className={classes.textField}
                   value={this.state.bio}
                   onChange={this.onChange}
                   fullWidth
                   />
                   <TextField type="text" 
                   name="website" 
                   label = "Website"
                   
                   placeholder=""
                   className={classes.textField}
                   value={this.state.website}
                   onChange={this.onChange}
                   fullWidth
                   />
                   <TextField type="text" 
                   name="location" 
                   label = "Location"
                   
                   placeholder=""
                   className={classes.textField}
                   value={this.state.location}
                   onChange={this.onChange}
                   fullWidth

                   />
               </form>
               </DialogContent>
               <DialogActions>
                   <Button onClick={this.handleProfileDetailsClose} color="primary">
                       Cancel
                   </Button>
                   <Button onClick={this.handleSubmit} color="primary">
                       Save
                   </Button>
               </DialogActions>
              

           </Dialog>
           </Fragment>
        )
    }
}
const mapStateToProps=(state)=>({
credentials:state.user.credentials
});
EditDetails.propTypes={
    editUserDetails:PropTypes.func.isRequired,
    classes:PropTypes.object.isRequired
}

export default connect(mapStateToProps,{ editUserDetails })(withStyles(style)(EditDetails))
