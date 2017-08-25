let axios = require('axios');

let validate = function(api, callback) {
  return axios.get(api)
    .then(function(res){
      let validations = res.data.validations;
      let customers = res.data.customers;
      let pagination = res.data.pagination;

      let filteredData = {
        "invalid_customers": []
      }
      for (let i=0; i<customers.length; i++) {

        // create an object to store invalid customers
        let invalidCustomer = {
          id: null,
          invalid_fields: []
        }

        for (let j=0; j<validations.length; j++) {

          // current key refers to the key that is being validated
          let currentKey = Object.keys(validations[j])[0];
          let valueOfCurrentKey = customers[i][currentKey];
          let currentValidation = validations[j][currentKey];

          function updateInvalidCustomer() {
            invalidCustomer.id = customers[i].id;
            invalidCustomer.invalid_fields.push(currentKey);
          }

          // only test validations that are required
          if (currentValidation.required) {
            if (currentValidation.type) {
              // test if value of current key matches the type defined in validation object
              if (typeof valueOfCurrentKey != currentValidation.type) {
                updateInvalidCustomer();
              }
            } else {
              // if no type is found, test if value exists
              if (valueOfCurrentKey === undefined || valueOfCurrentKey === null) {
                updateInvalidCustomer();
              }
            }

            // test if string is within the min max range (inclusive)
            // *this assumes "length" is only used for "type": "string"
            if (currentValidation.length && valueOfCurrentKey) {
              // check if min exists
              if (currentValidation.length.min) {
                if (valueOfCurrentKey.length < currentValidation.length.min) {
                  updateInvalidCustomer();
                }
              }
              // check if max exists
              if (currentValidation.length.max) {
                if (valueOfCurrentKey.length > currentValidation.length.max) {
                  updateInvalidCustomer();
                }
              }
            }
          }  
        }

        // if invalid customer exists, push to array
        if (invalidCustomer.id) {
          filteredData.invalid_customers.push(invalidCustomer);
        }
      }

      // when filtered data is available, pass to callback
      return callback(filteredData);
    })

    .catch(function(err){
      return err
    });
}

// // If you want to tweak and test out the function, uncoment the code below
// validate('https://backend-challenge-winter-2017.herokuapp.com/customers.json', (filteredData)=>{
//   console.log(filteredData);
// })


// create express server
let express = require('express')
let app = express();
let path = require('path');
let bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// create endpoint for /
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname +'/index.html'), {});
})

// create api endpoint for filtered data
app.post('/filteredData', function(req, res) {
  validate(req.body.url, (filteredData)=>{
    res.json(filteredData);
  });
})

// listen on port 3000
app.listen(process.env.PORT, function () {
  console.log('App is listening on port ' + process.env.PORT)
})