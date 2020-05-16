import React ,{ Component} from 'react';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './App.css';
import themeFile from './util/theme';
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
import {provider} from 'react-redux';
import store from './redux/store';


//global variable
let authenticated;

//create theme
const theme=createMuiTheme(themeFile);

const token=localStorage.FBIdToken;
if(token){
const decodedToken=jwtDecode(token);
//console.log(decodedToken);
if(decodedToken.exp * 1000 < Date.now()){
  window.location.href='/login';
  authenticated=false;
}else{
  authenticated=true;
}

}

class App extends Component {
  render(){
  return (
    <MuiThemeProvider theme={theme}>
      <provider store={store}>
        
      </provider>
    <div className="App">
     <Router>
       <Navbar/>
       <div className="container">
       <Switch>
         <Route exact path='/' component={home} ></Route>
         <AuthRoute exact path='/login' component={login} authenticated={authenticated}></AuthRoute>
         <AuthRoute exact path='/signup' component={signup} authenticated={authenticated}></AuthRoute>
       </Switch>
       </div>

     </Router>
    </div>
    </MuiThemeProvider>
  );
  }
}

export default App;
