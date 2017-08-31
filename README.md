# shopify-backend-challenge-2017
This is the code I wrote for shopify's backend challenge 2017. The code contains a function that takes customer information from a JSON object provided by https://backend-challenge-winter-2017.herokuapp.com/customers.json and returns a list of customers that are invalid depending on the validations chosen. I also launched a simple express server to showcase the code in action on heroku at https://leroywan-backend-challenge.herokuapp.com/

### Run Locally
<pre>npm install</pre>
<pre>node backend-challenge.js</pre>

### Note
More than one instances of the same attribute can be found within the invalid_fields array if more than one error occurs regarding that attribute (ex. name is not within max/min range && name type is a number. If you would like the same attribute to only show once, create a function that will remove the duplicates for you. 
