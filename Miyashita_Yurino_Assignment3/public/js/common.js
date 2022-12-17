/*
Yurino Miyashita
this JS file to save key in session storahe and specific for IR1 for users to come back to the last product page. 
I had to implement brower side session to solve IR1 for this assignment. 
If the page was stored in localStorage when there was no sessionStorage key, redirect to it
*/
const browse = sessionStorage.getItem('browse');
if(browse === null) {
  // when you first see the page
  sessionStorage.setItem('browse', true);
  const page = localStorage.getItem('page');
  // When I left and came back
  if(page !== null) {
    location.replace(page);
  }
}
// Save current page
localStorage.setItem('page', location.href);

