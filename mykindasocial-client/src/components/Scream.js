import React ,{ Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { likeScream,unlikeScream} from '../redux/actions/dataActions';
import 
    DeleteScream
from './DeleteScream';
import MyButton from '../util/MyButton';
import withStyles from '@material-ui/core/styles/withStyles';


//MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//import icons
import Chat from '@material-ui/icons/Chat';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
const styles={
    card:{
        display:'flex',
        marginBottom:20,
        position:'relative'
    },
    image: {
        minWidth: 200
    },
    content: {
        padding:25,
        objectFit:'cover'
    }
}

class Scream extends Component
{
    likedScream=()=>{
        if(this.props.user.likes && this.props.user.likes.find(l=>l.screamId===this.props.Scream.id))
        return true;
        else
        return false;
    };
    likeScream=()=>
    {

        this.props.likeScream(this.props.Scream.id);
       

    };
    unlikeScream=()=>{
        this.props.unlikeScream(this.props.Scream.id);
       
    };
    render()
    {
        dayjs.extend(relativeTime);
        const { classes, Scream:{ body,createdOn,userImage,userHandle,id,likeCount,commentCount},
        user:{
                
            credentials:{handle},
             authenticated
            } }=this.props;
        const likeButton=!authenticated?(
          <MyButton>.
              <Link to="/login">
                  <FavoriteBorder color="primary"/>
                  </Link>
          </MyButton>
        ):(
this.likedScream()?(<MyButton tip="undo like" onClick={this.unlikeScream}>
        <Favorite color="primary"/>
    </MyButton>):(<MyButton tip="like" onClick={this.likeScream}>
        <FavoriteBorder color="primary"/>
    </MyButton>)
        );
        const deleteButton=authenticated && userHandle===handle?(
            <DeleteScream screamId={id} />
        ):(null);
        return(
           <Card className={classes.card}>
               <CardMedia 
               image={userImage} title="profile picture" className={classes.image} />
               <CardContent className={classes.content}>
               <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color='primary'>
                   {userHandle}
               </Typography>
               {deleteButton}
               <Typography variant="body2" color="textSecondary">{dayjs(createdOn).fromNow()}</Typography>
               <Typography variant="body1" color="textSecondary">{body}</Typography>
               {likeButton}
               <span>{likeCount}</span>
               <MyButton tip="comments">
                   <Chat color="primary"/>
                   </MyButton>
                   <span>{commentCount} Comments</span>
               </CardContent>
              

           </Card>
        )
    }
}
Scream.propTypes={
    likeScream:PropTypes.func.isRequired,
    unlikeScream:PropTypes.func.isRequired,
    
    user:PropTypes.object.isRequired,
    Scream:PropTypes.object.isRequired,
    classes:PropTypes.object.isRequired
}
const mapStateToProps=(state)=>({
user:state.user
});
const mapActionToProps={
likeScream,
unlikeScream,

};
//Example of HOC(higher order component)
export default connect(mapStateToProps,mapActionToProps)(withStyles(styles)(Scream));
