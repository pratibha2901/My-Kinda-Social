import React ,{ Component} from 'react';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './App.css';
import themeFile from './util/theme';
import axios from 'axios';
//import pages

import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

     
//import components

import Navbar from './components/Navbar';
import AuthRoute from './util/AuthRoute';


//styles import
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//import redux
import {Provider} from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser,getUserData } from './redux/actions/userActions';


//global variable
//let authenticated;

//create theme
const theme=createMuiTheme(themeFile);

const token=localStorage.FBIdToken;
if(token){
const decodedToken=jwtDecode(token);
//console.log(decodedToken);
if(decodedToken.exp * 1000 < Date.now()){
  window.location.href='/login';
 store.dispatch(logoutUser())
}else{
  store.dispatch({
    type:SET_AUTHENTICATED
  });
  axios.defaults.headers.common['Authorization']=token;
  store.dispatch({
    getUserData()
  });
}

}

class App extends Component {
  render(){
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
      
    
     <Router>
       <Navbar/>
       <div className="container">
       <Switch>
         <Route exact path='/' component={home} ></Route>
         <AuthRoute exact path='/login' component={login} ></AuthRoute>
         <AuthRoute exact path='/signup' component={signup} ></AuthRoute>
       </Switch>
       </div>

     </Router>
  
    </Provider>


    </MuiThemeProvider>
  );
  }
}

export default App;
