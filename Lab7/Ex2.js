require("./product_data.js");


for(product_index = 1; eval("typeof name"+product_index) != 'undefined' ; product_index++) {

    console.log(`${product_index}. ${eval('name' + product_index)}`);
    
}
console.log("That's all we have!");

document.write(`
<table border="1">
    <tr><th>Number</th><th>Item</th></tr> 
    <tr><td>1</td><td>HTC</td></tr>
    <tr><td>2</td><td>Apple</td></tr>
    <tr><td>3</td><td>Nokia</td></tr>
    <tr><td>4</td><td>Samsung</td></tr>
    <tr><td>5</td><td>Blackberry</td></tr>
</table>
`);

//<tr><td>${prod_num}</td><td>${eval("name"+prod_num)}</td></tr>
/* this is for table one
*/
//<script src="./products_data.js"></script>
/* while(prod_num++ <num_products){ 
    document.write(`
    <tr><td>${prod_num}</td><td>${eval("name"+prod_num)}</td></tr>
    
    `);
}
</script>
*/
