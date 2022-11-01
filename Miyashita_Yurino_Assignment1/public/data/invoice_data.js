// setting up Today's date in mm/dd/yyyy format
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

//company address
var company = "The Bookstore";
var street = "344 Kaimuki Av";
var city = "honolulu";
var state = "Hawaii";
var zipcode = "96822";
var phone_number = "808 667 8967";

//due dates