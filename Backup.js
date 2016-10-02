Listings1 = new Mongo.Collection('listings1');
Listings2 = new Mongo.Collection('listings2');
Listings3 = new Mongo.Collection('listings3');

BuySell1 = new Mongo.Collection('buySell1');
BuySell2 = new Mongo.Collection('buySell2');
BuySell3 = new Mongo.Collection('buySell3');

var team_uid = 'yFPpdKHWc4yqKnZVNfeViQ';

var getItemId = function(symbol) {
    switch(symbol) {
        case '0005':
            return 0;
        case '0386':
            return 1;
        case '0388':
            return 2;
        case '3988':
            return 3;
        case '0001':
            return 4;
    }
};

var exchanges = ['1', '2', '3'];
var items = ['0005', '0386', '0388', '3988', '0001'];

var exchX_itemY = [
    [ {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0} ],
    [ {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0} ],
    [ {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0}, {prev: 0, cur: 0} ]
];

var average_prev = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

var average_cur = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

var sumDiffSq = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

var sd = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

var bids = [ //Purchasing price
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var asks = [ //Selling price
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var total = 0;
var sdScale = 0.5;
var quantity = 10;
var timeInterval = 100;
var maxAsk = [0, 0, 0, 0, 0]; //Store the exchange market of highest selling price
var minBid = [0, 0, 0, 0, 0]; //Store the exchange market of lowest buying price
var spendingLimit = 200000;

if (Meteor.isServer) {
    Listings1.remove({});
    Listings2.remove({});
    Listings3.remove({});

    var myInt1, myInt2, myInt3;
    Meteor.methods({
        'start': function () {
            console.log("START FUNCTION CALLED");
            myInt1 = Meteor.setInterval(function(){
                total++;
                var response = HTTP.get('http://cis2016-exchange1.herokuapp.com/api/market_data/', {}, function(error, response){
                    if(!error) {
                        _.each(response.data, function (item) {
                            var exchId = 0;
                            var itemId = getItemId(item.symbol);
                            var data_cur = (parseFloat(item.bid) + parseFloat(item.ask)) / 2;
                            var remember = average_cur[exchId][itemId];
                            average_cur[exchId][itemId] = ( 1.0 * average_prev[exchId][itemId] * (total - 1) + data_cur ) / total;
                            average_prev[exchId][itemId] = remember;

                            var remember2 = exchX_itemY[exchId][itemId].cur;
                            exchX_itemY[exchId][itemId].cur = data_cur;
                            exchX_itemY[exchId][itemId].prev = remember2;

                            sumDiffSq[exchId][itemId] += (data_cur - average_cur[exchId][itemId]) * (data_cur - average_cur[exchId][itemId]);
                            sd[exchId][itemId] = Math.sqrt(sumDiffSq[exchId][itemId] / total);

                            bids[itemId][exchId] = parseFloat(item.bid);
                            asks[itemId][exchId] = parseFloat(item.ask);

                            Listings1.insert(item);
                        });
                    }
                });
                //console.log("Updated market for exchange: " + 1);
            }, timeInterval);

            myInt2 = Meteor.setInterval(function(){
                var response = HTTP.get('http://cis2016-exchange2.herokuapp.com/api/market_data/', {}, function(error, response){
                    if(!error) {
                        _.each(response.data, function (item) {
                            var exchId = 1;
                            var itemId = getItemId(item.symbol);
                            var data_cur = (parseFloat(item.bid) + parseFloat(item.ask)) / 2;
                            var remember = average_cur[exchId][itemId];
                            average_cur[exchId][itemId] = ( 1.0 * average_prev[exchId][itemId] * (total - 1) + data_cur ) / total;
                            average_prev[exchId][itemId] = remember;

                            var remember2 = exchX_itemY[exchId][itemId].cur;
                            exchX_itemY[exchId][itemId].cur = data_cur;
                            exchX_itemY[exchId][itemId].prev = remember2;

                            sumDiffSq[exchId][itemId] += (data_cur - average_cur[exchId][itemId]) * (data_cur - average_cur[exchId][itemId]);
                            sd[exchId][itemId] = Math.sqrt(sumDiffSq[exchId][itemId] / total);
                            bids[itemId][exchId] = parseFloat(item.bid);
                            asks[itemId][exchId] = parseFloat(item.ask);

                            Listings2.insert(item);
                        });
                    }
                });
                //console.log("Updated market for exchange: " + 2);
            }, 100);

            myInt3 = Meteor.setInterval(function(){
                var response = HTTP.get('http://cis2016-exchange3.herokuapp.com/api/market_data/', {}, function(error, response){
                    if(!error) {
                        _.each(response.data, function (item) {
                            var exchId = 2;
                            var itemId = getItemId(item.symbol);
                            var data_cur = (parseFloat(item.bid) + parseFloat(item.ask)) / 2;
                            var remember = average_cur[exchId][itemId];
                            average_cur[exchId][itemId] = ( 1.0 * average_prev[exchId][itemId] * (total - 1) + data_cur ) / total;
                            average_prev[exchId][itemId] = remember;

                            var remember2 = exchX_itemY[exchId][itemId].cur;
                            exchX_itemY[exchId][itemId].cur = data_cur;
                            exchX_itemY[exchId][itemId].prev = remember2;

                            sumDiffSq[exchId][itemId] += (data_cur - average_cur[exchId][itemId]) * (data_cur - average_cur[exchId][itemId]);
                            sd[exchId][itemId] = Math.sqrt(sumDiffSq[exchId][itemId] / total);

                            bids[itemId][exchId] = parseFloat(item.bid);
                            asks[itemId][exchId] = parseFloat(item.ask);

                            Listings3.insert(item);
                        });
                    }
                });
                //console.log("Updated market for exchange: " + 3);
            }, timeInterval);


            Meteor.call('meanReversion');
            //Meteor.call('arbitrage');
        },

        'meanReversion': function(){
            Meteor.setInterval(function () {
                for(var i = 0; i < exchanges.length; i++) {
                    for(var j = 0; j < items.length; j++) {

                        var average = average_cur[i][j];
                        var previousPrice = exchX_itemY[i][j].prev;
                        var currentPrice = exchX_itemY[i][j].cur;

                        var upperSdAvg = average + sd[i][j] * sdScale;
                        var lowerSdAvg = average - sd[i][j] * sdScale;

                        if (previousPrice < lowerSdAvg && previousPrice < currentPrice && currentPrice < lowerSdAvg) {
                            Meteor.call('marketBuy', exchanges[i], items[j], quantity);
                            console.log("Bought " + quantity + " shares from item " + items[j] + " at exchange " + exchanges[i]);
                        }

                        console.log(previousPrice > upperSdAvg && previousPrice > currentPrice && currentPrice > upperSdAvg);
                        if (previousPrice > upperSdAvg && previousPrice > currentPrice && currentPrice > upperSdAvg) {
                            console.log(previousPrice > upperSdAvg && previousPrice > currentPrice && currentPrice > upperSdAvg);
                            Meteor.call('marketSell', exchanges[i], items[j], quantity);
                            console.log("Sold " + quantity + " shares of item " + items[j] + " at exchange " + exchanges[i]);
                        }

                    }
                }

                // console.log(average_cur);

            }, timeInterval);
        },

        'arbitrage': function(){
            Meteor.setInterval(function(){
                for(var i = 0; i < items.length; i++)
                {
                    var minBidValue = bids[i][0];
                    var maxAskValue = asks[i][0];

                    for(var j = 0; j < exchanges.length; j++)
                    {
                        if(minBidValue > bids[i][j])
                        {
                            minBid[i] = j;
                            minBidValue = bids[i][j];
                        }

                        if(maxAskValue < asks[i][j])
                        {
                            maxAsk[i] = j;
                            maxAskValue = asks[i][j];
                        }
                    }

                    for(var k = 0; k < exchanges.length; k++)
                    {
                        if(spendingLimit - exchX_itemY[k][i].cur * quantity >= 0) {
                            if (maxAskValue < minBidValue && maxAsk[i] != minBid[i]) {
                                Meteor.call('marketBuy', exchanges[minBid[i]], items[i], quantity);
                                spendingLimit -= exchX_itemY[k][i].cur * quantity;
                                console.log("Bought " + quantity + " shares from item " + items[i] + " at exchange " + (exchanges[minBid[i]] + 1));

                                Meteor.call('marketSell', exchanges[maxAsk[i]], items[i], quantity);
                                spendingLimit += exchX_itemY[k][i].cur * quantity;
                                console.log("Sold " + quantity + " shares of item " + items[i] + " at exchange " + (exchanges[maxAsk[i]] + 1));
                            }
                        }
                    }

                }

            }, timeInterval);
        },

        'stop': function () {
            console.log("STOP FUNCTION CALLED");
            Meteor.clearInterval(myInt1);
            Meteor.clearInterval(myInt2);
            Meteor.clearInterval(myInt3);

        },
        'updateBuySellData': function (exchangeNum, symbol) {
            console.log("Updating buy/sell data for symbol: " + symbol + " on exchange: " + exchangeNum);

            HTTP.get('http://cis2016-exchange' + exchangeNum + '.herokuapp.com/api/market_data/' + symbol, {}, function (error, response) {

                var save_obj = {buy: [], sell: []};
                _.each(response.data.buy, function (value, key) {
                    var value_key_obj = {
                        price: parseFloat(key),
                        amount: value
                    };

                    save_obj.buy.push(value_key_obj);
                });
                _.each(response.data.sell, function (value, key) {
                    var value_key_obj = {
                        price: parseFloat(key),
                        amount: value
                    };

                    save_obj.sell.push(value_key_obj);
                });

                if (!error) {
                    switch (exchangeNum) {
                        case 1:
                            BuySell1.insert(save_obj);
                            break;
                        case 2:
                            BuySell2.insert(save_obj);
                            break;
                        case 3:
                            BuySell3.insert(save_obj);
                            break;
                    }
                }
            });

        },
        'marketBuy': function (exchange, symbol, qty) {
            console.log("market buy: exchange: " + exchange + " symbol: " + symbol + " qty: " + qty);
            var postData = {
                data: {
                    team_uid: team_uid,
                    symbol: symbol,
                    qty: qty,
                    order_type: 'market',
                    side: 'buy'
                }
            };
            var response = HTTP.post('http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders', postData, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log(response);
                }
            });
        },
        'marketSell': function (exchange, symbol, qty) {
            console.log("market sell: exchange: " + exchange + " symbol: " + symbol + " qty: " + qty);
            var postData = {
                data: {
                    team_uid: team_uid,
                    symbol: symbol,
                    qty: qty,
                    order_type: 'market',
                    side: 'sell'
                }
            };

            var response = HTTP.post('http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders', postData, function (error, response) {

                if (error) {
                    console.log(error);
                } else {
                    //console.log(response);
                }
            });
        },
        'limitBuy': function (exchange, symbol, qty, price) {
            console.log("limit buy: exchange: " + exchange + " symbol: " + symbol + " qty: " + qty + "price: " + price);

            var postData = {
                data: {
                    team_uid: team_uid,
                    symbol: symbol,
                    qty: qty,
                    order_type: 'limit',
                    side: 'buy',
                    price: price
                }
            };

            var response = HTTP.post('http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders', postData, function (error, response) {

                if (error) {
                    console.log(error);
                } else {
                    //console.log(response);
                }
            });
        },
        'limitSell': function (exchange, symbol, qty, price) {
            console.log("limit sell: exchange: " + exchange + " symbol: " + symbol + " qty: " + qty + " price: " + price);
            var postData = {
                data: {
                    team_uid: team_uid,//
                    symbol: symbol,
                    qty: qty,
                    order_type: 'limit',
                    side: 'sell',
                    price: price
                }
            };

            var response = HTTP.post('http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders', postData, function (error, response) {

                if (error) {
                    console.log(error);
                } else {
                    //console.log(response);
                }
            });
        },
        'deleteLimit': function (exchange, order_id) {
            console.log("delete limit: exchange: " + exchange + " order id: " + order_id);

            var response = HTTP.call('DELETE', 'http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders/' + order_id, {}, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log(response);
                }
            });
        }
    });
}

if (Meteor.isClient) {
    Template.buttons.events({
        'click .start': function () {
            Meteor.call('start');
        },
        'click .stop': function () {
            Meteor.call('stop');
        },
        'click .test': function () {
            Meteor.call('updateBuySellData', 1, "0001");
        },
        'click .testAkhan': function () {
            Meteor.call('marketBuy', 1, '0388', 10);
            // Meteor.call('marketSell', 1, '0388', 10);
            // Meteor.call('limitBuy', 1, '0388', 10, 0);
            // Meteor.call('limitSell', 1, '0388', 10, 100000);
            // Meteor.call('deleteLimit', 1, '596c80a2-3217-4845-8fc2-f4b868555115');
        }
    });
}
