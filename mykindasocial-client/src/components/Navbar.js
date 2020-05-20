import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';

//import Icons
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';

class Navbar extends Component
{
    render()
    {
        const { authenticated }=this.props;
        return(<div>
            <AppBar position='fixed'>
                <Toolbar className='nav-container'>
                    {authenticated?
                    (
                        <Fragment>
                            <MyButton tip="Post a scream!">
                            <AddIcon color="primary"/>
                            </MyButton>
                            <Link to="/">
                                <MyButton tip="Home">
                                     <HomeIcon color="secondary"/>
                                 </MyButton>
                            </Link>
                            <MyButton tip="Notifications">
                            <NotificationsIcon color="primary"/>
                            </MyButton>

                        </Fragment>
                    ):
                    (
                    <Fragment>
                        <Button color='inherit' component={Link} to='/'>Home</Button>
                        <Button color='inherit' component={Link} to='/login' >Login</Button>
                        <Button color='inherit' component={Link} to='/signup'>SignUp</Button>
                    </Fragment>
                    )}
                </Toolbar>
            </AppBar>

        </div>)
    }

}
Navbar.propTypes={
    authenticated:PropTypes.bool.isRequired
}
const mapStateToProps=(state)=>({
    authenticated:state.user.authenticated,
  
});
export default connect(mapStateToProps)(Navbar);