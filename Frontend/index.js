const socket = io("https://127.0.0.1:4000");

socket.on('update', (data) => {
  
    const id = data.documentKey._id;
    const updatedValue = data.updateDescription.updatedFields;
    const stockDiv = document.getElementById(id);
    
    const stock_ = stocksData.find(stock => stock._id === id);
    UpdateMarketDepthElement(stockDiv, updatedValue, stock_);
  });

let stockId;
let transactionType;
let stocksData = [];

function disablePriceInput() {
    document.getElementById("price-input").disabled = true;
  }
  
  function enablePriceInput() {
    document.getElementById("price-input").disabled = false;
  }

function toggleMarketDepth(stockId) {
    var stock_ = document.getElementById(stockId);
    var marketDepth = stock_.querySelector('.market-depth');
    var computedStyle = window.getComputedStyle(marketDepth);

    if (computedStyle.display === 'none') {
        marketDepth.style.display = 'block';
    } else {
        marketDepth.style.display = 'none';
    }
}

function setOrderContainerStyle()
{
    var topColor;

    if(transactionType == 'buy')
    {
        topColor = getComputedStyle(document.documentElement).getPropertyValue('--bidBlue');
    }
    else if(transactionType == 'sell')
    {
        topColor = getComputedStyle(document.documentElement).getPropertyValue('--offerRed');
    }

    var orderTop = document.getElementById('order-top');
    var orderButton = document.getElementById('order-complete-button');

    orderTop.style.backgroundColor = topColor;
    orderButton.style.backgroundColor = topColor;
    orderButton.style.borderColor = topColor;

    orderButton.textContent = transactionType.toUpperCase();
}

function toggleOrderContainer() {
    var orderContainer = document.getElementById('order-container');
    var computedStyle = window.getComputedStyle(orderContainer);

    if (computedStyle.display === 'none') {
        orderContainer.style.display = 'block';
    }
}

function openOrderContainer(infoDiv) {
    const buttons = infoDiv.querySelectorAll('.bs-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const parentDiv = this.closest('.stock');
            stockId = parentDiv.id;
            transactionType = button.id;
            setOrderContainerStyle();
            toggleOrderContainer();

            if (parentDiv.id) {
                console.log(parentDiv.id, " ", button.id);
            } else {
                console.log('Parent div does not have an ID');
            }
        });
    });
}

function createOrder() {
    const buyButton = document.querySelector('.order-complete-button');

    buyButton.addEventListener('click', function() {
        const qty = document.getElementById('qty-input').value;
        const price = document.getElementById('price-input').value;
        const orderType = document.querySelector('input[name="order_type"]:checked').value;

        const data = {
            tradingSymbolId: stockId,
            tradingSymbol: "RELIANCE",
            userID: '65fd30918ff4ee22f50fb077',
            transactionType: transactionType,
            orderType: orderType,
            quantity: qty
        };

        console.log(orderType);

        if(orderType === 'limit') {
            data.price = price;
        }

        fetch('https://127.0.0.1:4000/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

function openTab(event, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

function UpdateMarketDepthElement(stockDiv, updatedFields, stock_) {

    for (let key in updatedFields) {

        if(key == 'close')
        {
            stock_.close = updatedFields[key];
            UpdateClose(stockDiv, stock_);
        }
        else
        {
            stockDiv.querySelector('.'+key).textContent = updatedFields[key];
        }
    }
}

function UpdateClose(stockDiv, stock) {

    const stockName = stockDiv.querySelector('.stock-name');
    const stockChange = stockDiv.querySelector('.stock-change');
    const stockPercentage = stockDiv.querySelector('.stock-percentage');
    const stockLTP = stockDiv.querySelector('.close');

    let change = stock.close-stock.prevClose;
    let percentage = (change / stock.prevClose) * 100;
    let ltp = stock.close;

    change = change.toFixed(2);
    percentage = percentage.toFixed(2);

    stockChange.textContent = change;
    stockPercentage.textContent = percentage + '%';

    if (ltp % 1 !== 0) {
        ltp = ltp.toFixed(2);
    } else {
        ltp = ltp + '.00';
    }

    if(stock.close - stock.prevClose >= 0) {
        stockName.classList.add('price-green');
        stockLTP.classList.add('price-green');
        stockLTP.textContent = `▲ ${ltp}`;
    }
    else
    {
        stockName.classList.add('price-red');
        stockLTP.classList.add('price-red');
        stockLTP.textContent = `▼ ${ltp}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://127.0.0.1:4000/api/v1/stocks')
        .then(response => response.json())
        .then(stocks => {
            const stockContainer = document.getElementById('stock-container');

            stocksData = stocks;

            stocks.forEach((stock) => {
                console.log(stock);
                const stockDiv = createStockElement(stock);
                stockContainer.appendChild(stockDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching stocks:', error.message);
            alert('Error fetching stocks. Please try again.');
        });

    function createStockElement(stock) {

        const template = document.getElementById('stock-template');
        const stockDiv = template.content.cloneNode(true);
        const stock_ = stockDiv.querySelector('.stock');
        stock_.setAttribute('id', stock._id);

        const headerDiv = stockDiv.querySelector('.stock-header');
        headerDiv.setAttribute('onclick', `toggleMarketDepth('${stock._id}')`);

        

        const depthDiv = stockDiv.querySelector('.market-depth');
        //depthDiv.setAttribute('id', stock._id);

        createMarketDepthElement(stockDiv, stock);
        openOrderContainer(depthDiv);

        return stockDiv;
    }

    function createMarketDepthElement(stockDiv, stock) {

        const stockName = stockDiv.querySelector('.stock-name');
        stockName.textContent = stock.tradingSymbol;

        UpdateClose(stockDiv, stock);
    
        stockDiv.querySelector('.open').textContent = stock.open;
        stockDiv.querySelector('.high').textContent = stock.high;
        stockDiv.querySelector('.low').textContent = stock.low;
        stockDiv.querySelector('.prevClose').textContent = stock.prevClose;
        stockDiv.querySelector('.volume').textContent = stock.volume;
    }

    createOrder();
});

const sampleData = [
    { time: '14:57:16', type: 'SELL', instrument: 'RELIANCE', quantity: '10', avg : 2197, status: 'COMPLETE'}
];

function fetchOrderData() {
    fetch('https://127.0.0.1:4000/api/v1/orders/65fd30918ff4ee22f50fb077')
        .then(response => response.json())
        .then(data => {

            orders = data.orders;

            formatOrderData(orders);
            
        })
        .catch(error => {
            console.error('Error fetching orders:', error.message);
            alert('Error fetching stocks. Please try again.');
        });
}

function formatOrderData(orders) {

    orders.forEach((order) => {

        console.log(order);
        const date = new Date(order.createdAt);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        const time = `${hours}:${minutes}:${seconds}`;

        sampleData.push({
            time: time,
            type: order.transactionType,
            instrument: order.tradingSymbol,
            quantity: order.quantity,
            avg: order.price,
            status: order.status
        });

        //console.log(time);
    });

    populateOrderTable();

}

function populateOrderTable() {
    const tableBody = document.getElementById('table-body');

    tableBody.innerHTML = '';

    sampleData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.time}</td>
            <td>${item.type}</td>
            <td>${item.instrument}</td>
            <td>${item.quantity}</td>
            <td>${item.avg}</td>
            <td>${item.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

function openLoginPage() {
    window.location.href = '/Frontend/login.html';
}

async function checkUserLoggedIn() {
    try {
        const response = await fetch('https://127.0.0.1:4000/api/v1/users/checkLoggedIn');
        const data = await response.json();
        const isLoggedIn = data.isLoggedIn;
        const userData = data.userData;

        console.log(isLoggedIn);
        console.log(userData);

        // if (isLoggedIn) {
        //     document.querySelectorAll('.tabcontent').forEach(tab => {
        //         tab.style.display = 'block';
        //     });

        //     // if (userData) {
        //     //     document.getElementById('username').innerText = userData.username;
        //     // }

        //     console.log(userData);
        // } else {

            

        //     // document.querySelectorAll('.tabcontent').forEach(tab => {
        //     //     tab.style.display = 'none';
        //     // });
        // }
    } catch (error) {
        console.error('Error checking user login status:', error);
    }
}
window.onload = checkUserLoggedIn;
//fetchOrderData();