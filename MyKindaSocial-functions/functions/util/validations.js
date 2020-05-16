// Helper functions
const isEmpty = (anyString) => {
  if (anyString.trim() === "") {
    return true;
  } else {
    return false;
  }
};
const isValidEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};
exports.validateLoginData = (loginUser) => {
  let errors = {};
  if (isEmpty(loginUser.email)) {
    errors.email = "Email cannot be empty";
  }
  if (isEmpty(loginUser.password)) {
    errors.password = "Passwords cannot be empty";
  }
  return ({
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  });
};
exports.validateSignUpData = (newUser) => {
  let errors = {};
  //Validate user input
  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else {
    if (!isValidEmail(newUser.email)) {
      errors.email = "Email not valid";
    }
  }

  if (isEmpty(newUser.handle)) {
    errors.handle = "Must not be empty";
  }
  if (isEmpty(newUser.password)) {
    errors.password = "Must not be empty";
  }
  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return{
      errors,
     
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
exports.reduceUserDetails=(data)=>
{
    let userDetails={};
    if(!isEmpty(data.bio.trim()))
    {
        userDetails.bio=data.bio;
    } 
    if(!isEmpty(data.website.trim()))
    {
        
        userDetails.website=data.website.trim().substring(0,4)==='http'?data.website.trim():`http://${data.website.trim()}`;
    } 
    if(!isEmpty(data.location.trim()))
    {
        userDetails.location=data.location;
    } 
    return userDetails;
}
