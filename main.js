Listings1 = new Mongo.Collection('listings1');
Listings2 = new Mongo.Collection('listings2');
Listings3 = new Mongo.Collection('listings3');

BuySell1 = new Mongo.Collection('buySell1');
BuySell2 = new Mongo.Collection('buySell2');
BuySell3 = new Mongo.Collection('buySell3');

var team_uid = 'kKcYIo6QignhVwziE889Mg'; //hanks

if (Meteor.isServer) {
    Listings1.remove({});
    Listings2.remove({});
    Listings3.remove({});

    var myInt1, myInt2, myInt3;
    Meteor.methods({
        'start': function () {
            console.log("START FUNCTION CALLED");
            myInt1 = Meteor.setInterval(function(){
                    var response = HTTP.get('http://cis2016-exchange' + 1 + '.herokuapp.com/api/market_data/');
                    _.each(response.data, function (item) {
                        Listings1.insert(item);
                    });
                console.log("Updated market for exchanges: " + 1);
            }, 100);
            myInt2 = Meteor.setInterval(function(){
                var response = HTTP.get('http://cis2016-exchange' + 2 + '.herokuapp.com/api/market_data/');
                _.each(response.data, function (item) {
                    Listings1.insert(item);
                });
                console.log("Updated market for exchanges: " + 2);
            }, 100);
            myInt3 = Meteor.setInterval(function(){
                var response = HTTP.get('http://cis2016-exchange' + 3 + '.herokuapp.com/api/market_data/');
                _.each(response.data, function (item) {
                    Listings1.insert(item);
                });
                console.log("Updated market for exchanges: " + 3);
            }, 100);

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
                console.log(save_obj);
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
                    console.log(response);
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
                    console.log(response);
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
                    console.log(response);
                }
            });
        },
        'limitSell': function (exchange, symbol, qty, price) {
            console.log("limit sell: exchange: " + exchange + " symbol: " + symbol + " qty: " + qty + " price: " + price);
            var postData = {
                data: {
                    team_uid: team_uid,
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
                    console.log(response);
                }
            });
        },
        'deleteLimit': function (exchange, order_id) {
            console.log("delete limit: exchange: " + exchange + " order id: " + order_id);

            var response = HTTP.call('DELETE', 'http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders/' + order_id, {}, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response);
                }
            });
        },

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