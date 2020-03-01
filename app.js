const puppeteer = require('puppeteer');
const fs = require('fs');
//Loads funds names from csv files and put them into array
const fundsList = fs.readFileSync('./assets/funds.csv','utf8').split('\r\n');
fundsList.splice(fundsList.length-1);

const getDataFromWebsite = require('./scrapingFunction');

const date = new Date();
const fileName = `Templeton prices ${date.getFullYear()}-${twoDigitFormat(date.getMonth()+1)}-${twoDigitFormat(date.getDate())}.csv`;

function twoDigitFormat(number) {
    return number < 10 ? '0' + number : number;
}

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    page.setViewport({height: 1080, width: 1920});

    const URL = 'https://www.franklintempleton.pl/investor/produkty/wyceny-stopy-zwrotu';

    await page.goto(URL, {
        waitUntil: 'networkidle2'
    });

    //Button to scroll down to checkbox and submit button
    //Checkbox
    //Submit button
    const expandBtnSelector = "span.modal__scroll-to-accept-icon";
    const checkBoxSelector = "label.au-target";
    const acceptBtnSelector = "#gateway-continue";

    const selectors = [expandBtnSelector, checkBoxSelector, acceptBtnSelector];

    //Clicks following selectors (used "for ... of" loop not to create new function instance so that await keyword works)
    for (const selector of selectors) {
        await page.waitForSelector(selector);
        await page.click(selector);
    }

    //wait for website to load data
    const tableFundPricesSelector = "[au-target-id='1758']";
    const tableFundNamesSelector = "[au-target-id='1737']";

    const tableSelectors = [tableFundPricesSelector,tableFundNamesSelector];
    for(const tableSelector of tableSelectors) {
        await page.waitForSelector(tableSelector);
    }

    await page.waitFor(5000);

    //await page.waitFor(() => {
    //    return Array.from(document.querySelectorAll("[au-target-id='1760']")).every(item => item.innerText != '');
    //});

    //gets data from website as object {priceDate, prices:[{name, price}]}
    const fundsData = await getDataFromWebsite(fundsList,page);

    console.log(fundsData);

    let csvDataString = `${fundsData.priceDate}\n`;

    csvDataString += fundsData.prices.reduce((string,fundData) => {
        return string += `${fundData.name};${fundData.price}\n`;
    },"");

    await fs.writeFile(fileName,csvDataString, (err) => {
        console.log(err);
    });

    console.log(`Prices for ${fundsData.prices.length} of ${fundsList.length} funds downloaded succesfully.`);

    await browser.close();
})();