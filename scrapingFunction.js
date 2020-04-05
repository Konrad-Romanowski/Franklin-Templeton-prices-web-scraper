function getDataFromWebsite(_fundList,_page,_tableFundNamesSelector) {

    const data = _page.evaluate((_fundList,_tableFundNamesSelector) => {
        // function sorts object by property name (sortField) with respect to order passed in array
        // stolen from: https://dev.to/afewminutesofcode/how-to-create-a-custom-sort-order-in-javascript-3j1p
        const customSort = ({objectWithData, orderArray, sortField}) => {
            const sortByObject = orderArray.reduce(
                (obj, item, index) => ({
                    ...obj,
                    [item]: index
                }),{});
            return objectWithData.sort((a,b) => sortByObject[a[sortField]] - sortByObject[b[sortField]]);
        }
        
        const priceDateSelector = "[au-target-id='990']";
        // grabs pricing date (second node with given selector on the website - thats why [1] is recalled)
        const priceDate = Array.from(document.querySelectorAll(priceDateSelector))[1].innerText;

        // 1. grab nodes from the website and creates an array,
        // 2. filter only those nodes with funds we are interested in
        // 3. reduce method creates an array of objects {fundName, price}
        const fundsData = Array.from(document.querySelectorAll(_tableFundNamesSelector))
        .filter(node => _fundList.includes(node.innerText))
        .reduce((acc,node) => {
            const fundData = {
                name: node.innerText,
                // slice(2) cuts off the currency abbreviation "zł"
                price: node.parentElement.nextElementSibling.nextElementSibling.firstElementChild.innerText.slice(2)
            }
            acc.push(fundData);
            return acc;
        },[]);

        return {priceDate, prices: customSort({objectWithData:fundsData, orderArray:_fundList, sortField:'name'})};
    },_fundList,_tableFundNamesSelector);

    return data;
}

module.exports = getDataFromWebsite;