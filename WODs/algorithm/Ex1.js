/*

    Implement the above algorithm in JS to determine the day of the week for ANY date. Start by defining variables day for the day a number from 1-31, month for the month (a String) “January”, “February”, etc., year a number 1900-2099 for the year
    Use your birth date as a test case.
    Use parseInt() or Math.floor() to get the divisor and drop the remainder
    To handle step 1 use if or a ternary operator
    Make an object monthKey from the month-key table and use it for Step 6
    Use the modulus operator % to get the remainder in Step 7
    Make an array of days of the week strings to convert Step 7 into the day as per the day number table
    Output the date and and the day of week to the console.

*/

// setting up the date
var day=31;
var month= "December";
var year= 2001;

const monthkey = {
    January:0,
    February:3,
    March:2,
    April:5,
    May:0,
    June:3,
    July:5,
    August:1,
    September:4,
    October:6,
    November:2,
    December:4,
};

// step 1 is the year 
step1= year; 

//step 2 devide step 1 by 4 drop the remainder add to step 1
step2 = parseInt(year/4)+year;

//step 3: devide step 1 by 100 drop the remainder subtract this from step 2
step3 = step2-parseInt(year/100);

//remainder2= step2%100;
//step=parseInt(step2-remiander2);

// step 4 divide step 1 by 400 drop the remainder add to step 3
step4 = parseInt(year/400)+step3;

//step5 add the day to step 4
step5 = day+step4; 

//step6 find the month key in the tale and add this to step 5 
step6 = monthkey[month] + step5;

// step 7 divide step 6 by  7 keep only the remainder 
step7 = step6%7;

// day of week resulty 
const daysarray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

console.log(month, day, year, daysarray[step7]); 