# Franklin Templeton funds prices web scraper

## A simple tool that downloads (scrapes) prices from Franklin templeton Investments website.


### Technologies Involved:
* Node.js
* Puppeteer


### How does the app work?
1. App gets the fund names from the funds.csv file in the assets folder (fund names have to be exacly the same as on the website),
2. opens the headless Chrome browser, goes to the URL and gets pricing date and prices,
3. saves the data in the .csv file in the prices folder. The order of the funds and prices in the file is exacly the same as in the file from which the fund names were picked.


### What I have learnt during the project?
1. Basics of Puppeteer,
2. How to select html nodes using attributes/props other than class or id,
3. How to create an array from an HTMLCollection or NodeList,
4. Basics of Git, since it's my first repository on GitHub.