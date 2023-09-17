# StockCompanyLookup
Search company by name or ticker
## Website Link: https://stock-company-lookup-d3abbd2fe8f8.herokuapp.com/

A Web App as follows:
An HTML form within an HTML file(index.html). The form has a text input field that asks the user to enter a stock ticker symbol OR a company name.  And a radio button field to indicate if the input field contains the symbol or the company name. The form action is directed to a stockApp.js file.  This file:
1) reads the form data
2) looks up the company data in the database
3) displays the name, stock ticker, and stock price for the company identified from the form data.
If the user enters a symbol that matches more than one company, all matching company names are displayed.

Database used - Mongodb Atlas
