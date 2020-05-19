import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';

//redux
import {connect} from 'react-redux';
//MUI 
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from '../util/theme';
//icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';


const theme = createMuiTheme(themeFile);
const styles={
    paper:{
        padding:20
    },
    Profile:{
     '& .image-wrapper':{
         textAlign:'center',
         position:'relative',
         '& button':{
             position:'absolute',
             top:'80%',
             left:'70%'
         }
    },
    '& .profile-image':{
        width:200,
        height:200,
        objectFit:'cover',
        maxWidth:'100%',
        borderRadius:'50%',
        
    },
    '& .profile-details':{
        textAlign:'center',
        '& span,svg':{
            verticalAlign:'middle'
        },
        '& a':{
          color:theme.palette.primary.main
        }
    },
    '& hr':{
        border:'none',
        margin:'0 0 10px 0'
    },
    '& svg.button':{
        '&:hover':{
            cursor:'pointer'
        }
    }

     
    },
    buttons:{
        textAlign:'center',
        '& a':{
            margin:'20px 10px'
        }
    }

};
 class Profile extends Component {
    handleImageChange={

    };
    render() {
        const { 
            classes,
            user:{
                
                credentials:{handle,createdOn,imageURL,bio,website,location},
                 loading,authenticated
                }
    }=this.props;
    let profileMarkup=!loading?(authenticated?(
        <Paper className={classes.paper}>
            <div className={classes.Profile}>
            <div className="image-wrapper">
                <img src={imageURL}  className="profile-image" alt="profile" />
                <input type="file" id="imageInput" onChange={this.handleImageChange}/>
                </div>
            <hr/>
            <div className="profile-details">
                <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                  @{handle}
                </MuiLink>
                <hr/>
                {bio && <Typography variant="body2">{bio}</Typography> }
                <hr/>
                {
                    location && (
                        <Fragment>
                           <LocationOn color="primary"/>
                               <span>
                                  {location}
                               </span>
                               <hr/>
                        </Fragment>
                    )}
                    {website && (
                        <Fragment>
                            <LinkIcon color="primary"/>
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {' '}{website}
                                </a>
                                <hr/>
                        </Fragment>
                    )}
                    <CalendarTodayIcon color="primary"/>
                    {' '}
                    <span>joined {dayjs(createdOn).format('MMM YYYY')}</span>
            </div>
            </div>
        </Paper>
    ):(
        <Paper className={classes.paper}>
            <Typography variant="body2" align="center">
                No Profile found,please login
            </Typography>
            <div className={classes.buttons}>
                <Button variant="contained" color="primary" component={Link} to="/login">
                    Login
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/signup">
                    Signup
                </Button>
            </div>
        </Paper>
    )):(<p>loading....</p>)
        return profileMarkup;
    }
}
const mapStateToProps=(state)=>({
    user:state.user,
    UI:state.UI
});
Profile.propTypes={
    user:PropTypes.object.isRequired,
    classes:PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(Profile));
