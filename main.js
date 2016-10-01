import './imports/bracketedOrder.js';

Listings1 = new Mongo.Collection('listings1');
Listings2 = new Mongo.Collection('listings2');
Listings3 = new Mongo.Collection('listings3');

BuySell1 = new Mongo.Collection('buySell1');
BuySell2 = new Mongo.Collection('buySell2');
BuySell3 = new Mongo.Collection('buySell3');

var team_uid = 'DXSloWjyT-EKW7NnGPDr2Q';

if (Meteor.isServer) {
    Listings1.remove({});
    Listings2.remove({});
    Listings3.remove({});

    //Session data (essentially global variables) call the function first to update them

    var myInt;
    Meteor.methods({
        'start': function () {
            console.log("START FUNCTION CALLED");
            myInt = Meteor.setInterval(function () {
                for (var k = 1; k <= 3; k++) {
                    var response = HTTP.get('http://cis2016-exchange' + k + '.herokuapp.com/api/market_data/');
                    _.each(response.data, function (item) {
                        //console.log(item);
                        switch (k) {
                            case 1:
                                Listings1.insert(item);
                                break;
                            case 2:
                                Listings2.insert(item);
                                break;
                            case 3:
                                Listings3.insert(item);
                                break;
                        }
                    });
                    //console.log(Listings.find().fetch());
                    console.log("Updated market for exchange: " + k);
                }
            }, 1000);
        },
        'stop': function () {
            console.log("STOP FUNCTION CALLED");
            Meteor.clearInterval(myInt);
            for (var k = 0; k < 99999; k++) {
                Meteor.clearInterval(k);
            }
        },
        'updateBuySellData': function (exchangeNum, symbol) {
            console.log("Updating buy/sell data for symbol: " + symbol + " on exchange: " + exchangeNum);
            var response = HTTP.get('http://cis2016-exchange' + exchangeNum + '.herokuapp.com/api/market_data/' + symbol);
            console.log(response.data);
            switch (exchangeNum) {
                case 1:
                    BuySell1.remove();
                    BuySell1.insert(item);
                    break;
                case 2:
                    BuySell2.remove();
                    BuySell2.insert(item);
                    break;
                case 3:
                    BuySell3.remove();
                    BuySell3.insert(item);
                    break;
            }
        },
        'updateExchangeData': function (exchangeNum) {
            console.log("Getting data from exchange: " + exchangeNum);
            var response = HTTP.get('http://cis2016-exchange' + exchangeNum + '.herokuapp.com/api/market_data');
            console.log(response.data);
            switch (exchangeNum) {
                case 1:
                    BuySell1.remove();
                    BuySell1.insert(item);
                    break;
                case 2:
                    BuySell2.remove();
                    BuySell2.insert(item);
                    break;
                case 3:
                    BuySell3.remove();
                    BuySell3.insert(item);
                    break;
            }
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
            Meteor.call('updateBuySellData', "1", "0001");
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
/*
 if (Meteor.isClient) {
 Meteor.subscribe('thePlayers');
 console.log("MARKET DATA");
 console.log(Listings.find().fetch());
 /*
 Tracker.autorun(function () {
 var marketData = Meteor.subscribe('market');
 console.log("MARKET DATA");
 console.log(Posts.find());
 //console.log(Posts);
 //console.log(Posts.find().fetch());
 });
 }


 Session.setDefault('market', 'all');

 Tracker.autorun(function() {
 if (Session.get('subreddit')) {
 var searchHandle = Meteor.subscribe('subredditSearch', Session.get('subreddit'));
 }
 });
 */