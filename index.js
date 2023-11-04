/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Harshitha Reddy Salguti Student ID: N01537582 Date: 02-11-2023
*
*
******************************************************************************
**/
// Import required modules and libraries
   
 const exphbs = require('express-handlebars'); // Handlebars.js for templating
var express = require('express');
var path = require('path');
var app = express();
const fs = require("fs").promises;

// Define a custom Handlebars helper to access properties with spaces
// const exphbs = require('express-handlebars');
const hbs = exphbs.create({ extname: '.hbs' });

// hbs.handlebars.registerHelper('isNotZero', function (value) {
//     return value !== 0;
//   });
// Define a custom Handlebars helper to convert "0" to "zero"
// Define a custom Handlebars helper to convert "0" to "zero"
hbs.handlebars.registerHelper('convertZero', function (value) {
    return value === 0 ? 'zero' : value;
});
hbs.handlebars.registerHelper('isZeroRating', function (rating, options) {
    if (rating === 'zero') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});



// Configure Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Handlebars as the view engine for Express
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');





const port = process.env.port || 3000; // Set the port number

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));



// Configure Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Handlebars as the view engine for Express
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');



(async () => {
    try {
      
      const data = await fs.readFile(path.join(__dirname, 'SuperSales.json'), 'utf-8');
      jsonData = JSON.parse(data);
      jsonData.forEach((item) => {
        for (const key in item) {
            if (key.includes(' ')) {
                const newKey = key.replace(/ /g, '_');
                item[newKey] = item[key];
                delete item[key];
            }
        }
    });
    } catch (error) {
      console.error('Error loading JSON data:', error);
    }
  })();
  (async () => {
    try {
      const data1= await fs.readFile(path.join(__dirname, 'ite5315-A1-Car_sales.json'), 'utf-8');
      jsonData1 = JSON.parse(data1);
    } catch (error) {
      console.error('Error loading JSON data:', error);
    }
  })();

//   Route for all data
app.get("/data", async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'ite5315-A1-Car_sales.json'), 'utf-8');
      jsonData = JSON.parse(data);
        console.log(jsonData);
      // Render the 'data.hbs' view and pass jsonData to it
      res.render("page/data", { title: "Data Page", jsonData: jsonData });
    } catch (error) {
      console.error("Error rendering 'data' view:", error);
      res.status(500).send("Internal Server Error");
    }
  });

// route for data/invoiceno/index

app.get('/data/invoiceNo/:index', (req, res) => {
    const index = req.params.index;

    if (!jsonData1) {
      res.status(500).send('JSON data not loaded');
      return;
    }

    try {
      const invoiceNo = jsonData.carSales[index]?.InvoiceNo;

      if (invoiceNo) {
        res.render('page/invoice', { index, invoiceNo });
      } else {
        res.render('page/invoice', { indexNotfound: 'Error: Index not found in JSON data' });
      }
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
      res.status(500).send('Error: Unable to parse JSON data');
    }
});


// Route for /search/manufacturer
app.get('/search/Manufacturer', async (req, res) => {
    res.render('page/search-form'); // Render the search form
  });
  
  app.post('/search/Manufacturer', (req, res) => {
    const enteredManufacturer = req.body.manufacturer.toLowerCase();
  
    if (!jsonData1) {
      res.status(500).send('JSON data not loaded');
      return;
    }
  
    const matchedCars = jsonData1.carSales.filter((item) =>
      item.Manufacturer.toLowerCase().includes(enteredManufacturer)
    );
  
    if (matchedCars.length > 0) {
      res.render('page/matched-cars', { matchedCars }); // Render matched cars template
    } else {
      res.status(404).render('page/no-matching-cars'); // Render "No Matching Cars" template
    }
  });
  
  
// Route for '/viewData' to display all sales info in an HTML table
app.get('/viewData', (req, res) => {
    res.render('page/viewData', { title: 'View All Sales Data', jsonData: jsonData });
  });
  
//   Route for /search/invoiceNo
app.get('/search/invoiceNo', async (req, res) => {
    res.render('page/search-invoiceNo');
  });
  
  app.post('/search/invoiceNo', (req, res) => {
    const enteredInvoiceNo = req.body.invoiceNo;
    
    if (!jsonData1) {
      res.status(500).send('JSON data not loaded');
      return;
    }
  
    const carSalesInfo = jsonData1.carSales.find((item) => item.InvoiceNo === enteredInvoiceNo);
 
    if (carSalesInfo) {
        res.render('page/invoiceNo-result', carSalesInfo);
      } else {
  } 
    // Render the invoiceNotFound template
    res.render('page/invoiceNotFound');
  }
);
  

// Define a route for the root URL ('/') that renders the 'partials/index' view
app.get('/', function(req, res) {
  res.render('partials/index', { title: 'Express' });
});

// Define a route for '/users' that sends a simple text response
app.get('/users', function(req, res) {
  res.send('respond with a resource');
});
// ... (previous code)

// Serve static files from the "page" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Define a route for '/about' to render the 'about' page
app.get('/about', function(req, res) {
    res.render('page/about', { title: 'About' });
});



//Route for step 8
// Route for '/modifiedViewData' to display sales info with non-zero ratings in an HTML table
app.get('/modifiedviewData', (req, res) => {
    if (!jsonData) {
      res.status(500).send('JSON data not loaded');
      return;
    }
  
    // Use the custom helper to filter out records with a "Rating" of zero
    const filteredData = jsonData.filter((item) => item.Rating !== 0);
  
    res.render('page/helper', { title: 'Filtered Data', jsonData: filteredData });
  });
  
  

// Define a catch-all route for any other URL that renders the 'partials/error' view
app.get('*', function(req, res) {
  res.render('partials/error', { title: 'Error', message: 'Wrong Route' });
});


// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
