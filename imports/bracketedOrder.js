/**
 * Created by gian on 10/1/16.
 */

var min, max;
var exchange = 1;
var orderUrl = 'http://cis2016-exchange' + exchange + '.herokuapp.com/api/orders';
var symbols = ['0001', '0005', '0386', '0388', '3988'];
var orderType;
var qty;
var price;

var setMin = function (i) {
    min = i;
}

var setMax = function(i) {
    max = i;
}

var setOrder = function() {
    for(var i = 1; i <=3; i++)
    {
        exchange = i;

        for(var j = 0; j < 5; j++) {
            var postData = {
                data: {
                    team_uid: 'kKcYIo6QignhVwziE889Mg',
                    symbol: symbols[j],
                }
            };
        }
    }

    var response = HTTP.post('http://cis2016-teamtracker.herokuapp.com/api/teams', postData, function( error, response ) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
        }
    });
};