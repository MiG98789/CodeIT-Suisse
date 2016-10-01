/**
 * Created by gian on 10/1/16.
 */

var min, max;
var exchange = 1;
var orderUrl = 'http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders';
var symbols = ['0001', '0005', '0386', '0388', '3988'];
var sideType = ['buy', 'sell'];
var qty = 100;
var orderType = ['market', 'limit'];
var price = 0;

var setMin = function (i) {
    min = i;
};

var setMax = function(i) {
    max = i;
};

var setOrder = function() {
    for(var i = 1; i <=3; i++)
    {
        exchange = i;

        for(var j = 0; j < 5; j++) {
            //TODO: IF (buy and price <= min) or (sell and price >= max)
            //TODO:
            var postData = {
                data: {
                    team_uid: 'kKcYIo6QignhVwziE889Mg',
                    symbol: symbols[j],
                    side: sideType,
                    qty: 100,
                    order_type: orderType[0];
        }

            var response = HTTP.post('http://cis2016-exchange'+exchange+'.herokuapp.com/api/orders', postData, function( error, response ) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response);
                }
            });
        }
        }
    }
};