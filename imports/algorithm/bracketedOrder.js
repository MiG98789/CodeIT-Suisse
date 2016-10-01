/**
 * Created by gian on 10/1/16.
 */

import {Listings1} from '../api/api.js';
import {Listings2} from '../api/api.js';
import {Listings3} from '../api/api.js';

var min, max;
var symbols = ['0001', '0005', '0386', '0388', '3988'];
var sideType = ['buy', 'sell'];
var orderType = ['market', 'limit'];
var qty = 100;

var getLatestListing = function (obj, symbol) {
    console.log(obj.findOne({'symbol': symbol}, {sort: {time: -1, limit: 1}}));
    return obj.findOne({'symbol': symbol}, {sort: {time: -1, limit: 1}});
}

var setMinMax = function (formMin, formMax) {
    min = formMin;
    max = formMax;

    console.log("Set minimum bracket at " + min + " and set maximum bracket at " + max);
};

var verifyOrder = function(obj) {
    for(var i = 1; i <=3; i++) { //Exchange number
        for (var j = 0; j < 5; j++) { //Symbol number
            if (getLatestListing(verifyOrder).ask <= min) //Buy at ask
            {
                Meteor.call('marketBuy', i, j, qty);
                console.log("Bracketed Order: Bought " + qty + " holdings");
            }
            else if(getLatestListing(symbols[j], i).bid >= max) //Sell at  bid
            {
                Meteor.call('marketSell', i, j, qty);
                console.log("Bracketed Order: Sold " + qty + " holdings");
            }
        }
    }
};

export {setMinMax};
export {verifyOrder};