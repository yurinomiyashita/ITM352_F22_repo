//created by Yurino Miyashita 
//modified Blake Saari's server.js 


// Load Express Package
let express = require('express');
let app = express();

// Load Body-Parser Package
let parser = require("body-parser");
// Load QueryString Package
const qs = require('querystring');
let fs = require('fs')
// Get Body
app.use(parser.urlencoded({
  extended: true
}));
// Monitor all requests
app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});
// Route all other GET requests to files in public 
app.use(express.static(__dirname + '/public'));
// Load Product Data   
let products = require(__dirname + '/products.json');
var json_file_path = __dirname + '/user_data.json';
// Initialize Quantity
products.forEach((prod, i) => {
  prod.quantity_available = products[i].quantity_available
})

var qty_obj = {};   //store quantity entered in store.html 


// Module installation
const crypto = require('crypto');
// The key for encryption, originally written in the env file for security reasons
const key = 'Ag3478eb15fh45019a5f9696c912cT62';

const algorithm = 'aes-256-cbc';
const delimiter = '$';

const encode = (originalText) => {
  const cipher = crypto.createCipher('aes-256-cbc', "pass")
  const crypted = cipher.update(originalText, 'utf-8', 'hex')
  const text = crypted + cipher.final('hex')
  return text;
};

//determine if there is error in quantity text box.
//copied from invoice.html in store 1 direcotry and modified 
function notAPosInt(arrayElement, returnErrors = false) {
  errors = [];    // [] is to display below if functions,  assume no errors at first
  if (arrayElement == '') {
    arrayElement = 0;
  }
  //assume there was no entry on texbox
  if (Number(arrayElement) != arrayElement) errors.push('Not a number!'); // Check if string is a number value
  if (arrayElement < 0) errors.push('Negative value!'); // Check if it is non-negative
  if (parseInt(arrayElement) != arrayElement) errors.push('Not an integer!'); // Check that it is an integer
  return (returnErrors ? errors : (errors.length == 0))  //if there is errors or not
}
// Routing taking json file    
app.get("/products.json", function (request, response, next) {
  response.type('.js');
  let products_str = `let products = ${JSON.stringify(products)};`;
  response.send(products_str);
});

// Process purchase request (validate quantities, check quantity available)
app.post("/purchase", function (request, response, next) {
  console.log(request.body); //getting request from invoice.html body
  let quantities = request.body['quantity']; //assigning value to quantities as quantity entred in store.html textbox
  let errors = {};
  let available_quantity = false;
  for (i in quantities) {
    console.log(quantities[i])
    if (notAPosInt(quantities[i]) == false) {
      errors['quantity' + i] = `Please submit valid data for ${products[i].name}!` //if quantity enetred is invalid number 
    }
    if (quantities[i] > 0) { //if quantity entered is greater than, meaning no errors
      available_quantity = true;
    }
    if (quantities[i] > products[i].quantity_available) { //if quantity entered is greater than quantity available 
      errors['quantity' + i] = `We currenly don't have ${(quantities[i])}${products[i].name}. please check our website later!`
    }
  }
  //taking quantity entered to display in invoice and direct to log in page
  //changed login.html from invoice.html
  let quantity_object = {
    "quantity": JSON.stringify(quantities)
  }; //creating string by quantity_object
  console.log(Object.keys(errors));
  if (Object.keys(errors).length == 0) { //no errors, 
    for (i in quantities) { //remove purchase quantity from inventory
      products[i].quantity_available -= Number(quantities[i]);
    }
    // Save quantity requested
    qty_obj = quantity_object
    //sends invoice with quantity with quary string
    response.redirect('./login.html?' + qs.stringify(quantity_object)); //inserting value as quary string to invoice.html table 
  } else { //with errors, redirect to login.html  
    let errors_obj = {
      "errors": JSON.stringify(errors)
    };
    console.log(qs.stringify(quantity_object));
    response.redirect('./store.html?' + qs.stringify(quantity_object) + '&' + qs.stringify(errors_obj)); //redirect to store.html and display errors 
  }
});

// --- Get data in advance from json file -- //
let users_reg_data;
// Check if user_data.json file exists
if(fs.existsSync(json_file_path)) {
  // Lab 13 Example Read file json file synchronously
  const data_string = fs.readFileSync(json_file_path, 'utf-8');
  console.log(`dataString---${data_string}`)
  // Since it cannot be treated as data in the state of a string, convert it to an object
  users_reg_data = JSON.parse(data_string);
  console.dir(users_reg_data)
} else {
  // when the file path does not exist
  console.log(`File path ${json_file_path} not found `)
}


// Querying input user and json data 
function isValidUserInfo(input_email, input_password) {
  let errors = [];
  let isUserError = false;
  // If user email key is undefined or key value does not exist
  if(!users_reg_data[input_email]) {       
    isUserError = true;    //when there is error
    errors.push(`User does not exist`);
  } else {    //email exists in user_data.json file 
    const stored_email = users_reg_data[input_email].email      //take email address from json file
    const stored_password = users_reg_data[input_email].password    //take password from json file 
    // If email does not match or password does not match
    const encrpt_input_password = encode(input_password)
    if(!(stored_email=== input_email) || !(stored_password === encrpt_input_password)) {
      isUserError = true;
      // if you identify a problem with which one is wrong, there is a vulnerability problem, so an error is displayed that either one does not match
      errors.push(`Incorrect password or username`);
    }
  }

  return {isUserError, errors}    //if there error or not. 
}

// Processing after pressing the login button
app.post("/login_user", function (request, response) {
    // Receiving request processing from users
    const body = request.body;
    // Convert customer-entered email addresses to lowercase
    const input_email = body['email'].toLowerCase();
    console.log("inputemail" + input_email)
    // Get password entered by customer
    const input_password = body['password'];body.password
    // Querying input user and json data
    const {isUserError, errors} = isValidUserInfo(input_email, input_password)
    if(isUserError) {       //when there is error in log in
      let errors_obj = { 
        "errors": JSON.stringify(errors)
      };
      console.log(qs.stringify(errors_obj));
      response.redirect('./login.html?' + qs.stringify(errors_obj)); //redirect to login.html and display errors       
    } else {
      // If there is no error, redirect to invoice
      //the password matches, use the object to pass the email address and full name to the next screen.
      qty_obj['email'] = input_email;
      qty_obj['fullname'] = users_reg_data[input_email].name;
      // Store quantity data
      let params = new URLSearchParams(qty_obj);
      response.redirect('./invoice.html?' + params.toString());    //send quantity entred as string to invoice.html
      return;
    }
  });

  app.post("/registrate_user", function (request, response) {
    // Start with 0 registration errors
    let registration_errors = {}
    const input_email = request.body['email'].toLowerCase();
    const input_password = request.body['password']
    const input_confirm_password = request.body['confirm_Password']
    const input_username = request.body['username']
    // If the password value entered by the user exists, do a format check on the email address
    if(input_email) {
      // Validate email address
      //case insensive 
      const email_regex = /^[a-zA-Z0-9\_\.]+@([a-zA-Z0-9]*\.)+[a-zA-Z]{3}$/
      if (!(email_regex.test(input_email))) {
        registration_errors['email'] = `Please enter a valid email address(Ex: jonny@hawaii.edu)`;
      }
      // Validates that the email inputted has not already been registered
      if (typeof users_reg_data[input_email] != 'undefined') {
        registration_errors['email'] = `This email address has already been registered`;
      }
    }

    // Validates that password is at least 10 characters
    if (input_password.length < 10 && input_password.length >16 ) {
      registration_errors['password'] = `Password must be at least 10 characters and at maximum 16 chacracters`;
    }
    // Validates that there is a password inputted
    else if (input_password.length == 0) {
      registration_errors['password'] = `Please enter a password`
    }
    //minimum 10 charcaters, Case sensitive, no space allowed 
    const password_regex = /^[a-zA-Z0-9][^ |　]{10,}$/  
    if (!(password_regex.test(input_password))) {
      registration_errors['password'] = `Please correct format password`;
    }
    // Validates that the passwords match
    if (input_password != input_confirm_password) {
      registration_errors['confirm_password'] = `Your passwords do not match, please try again`;
    }
    // Validate that the full name inputted consists of A-Z characters exclusively
    const username_regex = /^[A-Za-z, ]+$/      
    if (!(username_regex.test(input_username))) {
      registration_errors['username'] = `Please enter your first and last name`;
    }
    // maximum 30 character, minimum 2 characters, only alphabet 
    if (input_username < 2 || input_username.length > 30) {
      registration_errors['username'] = `Please enter a name less than 30 characters`;
    }

    //when there is no error, format info inputted to the json file   
    if(Object.keys(registration_errors).length === 0) {
      const encrypt_input_password = encode(input_password)
      users_reg_data[input_email] = {
        name: input_username,
        password: encrypt_input_password,
        email: input_email
      };
      // store data into user_data.json 
      //try is for handle if there is any errors, 
      try {  
        fs.writeFileSync(json_file_path, JSON.stringify(users_reg_data));   
        // Add product quantity data
        qty_obj['email'] = input_email;
        qty_obj['username'] = users_reg_data[input_email].name;
        let params = new URLSearchParams(qty_obj)
        // If registered send to invoice with product quantity data
        response.redirect('./invoice.html?' + params.toString());
      } catch(err) {
        console.log(err.message);
      }
    } else {
      // If errors exist, redirect to registration page with errors
      request.body['registration_errors'] = JSON.stringify(registration_errors);
      let params = new URLSearchParams(request.body);
      response.redirect("./registration.html?" + qs.stringify(params));
    }
  });

  app.post("/registration-update", function (request, response) {
    // Start with no errors
    let registration_update_erros = {};
    // Pulls data inputed into the form from the body
    let current_email = request.body['currenteEmail'].toLowerCase();
    let current_password = request.body['currentPassword'];
    let new_password = request.body['newPassword'];
    let confirm_password = request.body['confirmPassword'];
    // Validates that email is correct format
    const email_regex = /^[a-zA-Z0-9\_\.]+@([a-zA-Z0-9]*\.)+[a-zA-Z]{3}$/
    if (!(email_regex.test(current_email))) {
      registration_update_erros['email'] = `Please enter a valid email address(Ex: jonny@hawaii.edu)`;
    } else if (current_email.length == 0) {
      // Validates that there is a current email inputted
      registration_update_erros['email'] = `Please enter an current email address`
    }
    // Check if the re-entered update email address matches
    if (new_password != confirm_password) {
      registration_update_erros['confirmPassword'] = `password does not match`;
    }

    if(users_reg_data[current_email] === 'undefined') {
      registration_update_erros['email'] = `Please enter your registered email address`;
    } else {
      // Validates that password is at least 10 characters
      if (current_password.length < 10 && current_password.length >16 ) {
        registration_update_erros['password'] = `Password must be at least 10 characters and at maximum 16 chacracters`;
        // Validates that there is a password inputted
      } else if (current_password.length == 0) {
        registration_update_erros['password'] = `Please enter a password`
      }
      //minimum 10 charcaters, Case sensitive, no space allowed 
      const password_regex = /^[a-zA-Z0-9][^ |　]{10,}$/  
      if (!(password_regex.test(current_password))) {
        registration_update_erros['password'] = `Please correct format password`;
      }
      // Validates that passwords matches user_data.json
      if (users_reg_data[current_email].password != encode(current_password)) {
        registration_update_erros['password'] = `The password entered is incorrect`
      }
      // 
      if (new_password != confirm_password) {
        registration_update_erros['confirm_password'] = `The passwords you entered do not match`
      }
      // Validates that new password is different than current password
      if (new_password && confirm_password == current_password) {
        registration_update_erros['newpassword'] = `Your new password must be different from your old password`
      }
    }
    
    // If there are no errors
    if (Object.keys(registration_update_erros).length == 0) {
      users_reg_data[current_email].password = encode(new_password)
      // update data into user_data.json 
      //try is for handle if there is any errors, 
      try {  
        fs.writeFileSync(json_file_path, JSON.stringify(users_reg_data));   
        // Add product quantity data
        qty_obj['email'] = current_email;
        qty_obj['username'] = users_reg_data[current_email].name;
        let params = new URLSearchParams(qty_obj)
        // If registered send to invoice with product quantity data
        response.redirect('./login.html?' + params.toString());
      } catch(err) {
        console.log(err.message);
      }
    } else {
      // Request errors
      request.body['registration_update_erros'] = JSON.stringify(registration_update_erros);
      let params = new URLSearchParams(request.body);
      // Redirect back to update registration page with errors in string
      response.redirect('update_registration.html?' + params.toString());
    }
  })  
// Start server
app.listen(8080, () => console.log(`listening on port 8080`));