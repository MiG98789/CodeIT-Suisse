Listings = new Mongo.Collection('listings');
//loops
if (Meteor.isServer) {

}
var myInt;
Meteor.methods({
    'start': function () {
        myInt = Meteor.setInterval(function () {
            Listings.remove({});
            var response = HTTP.get('http://cis2016-exchange1.herokuapp.com/api/market_data/');

            _.each(response.data, function (item) {
                //console.log(item);
                Listings.insert(item);
            });
            //console.log(Listings.find().fetch());
            //console.log("********");
        }, 1000);
    },
    'stop': function () {
        Meteor.clearInterval(myInt);
    },
    'getBuySellData': function (exchangeNum, symbol) {
        var response = HTTP.get('http://cis2016-exchange' + exchangeNum + '.herokuapp.com/api/market_data/' + symbol);
        console.log(response);
        Session.set("buySellData", response);
    }
});

if (Meteor.isClient) {
    Template.buttons.events({
        'click .start': function () {
            Meteor.call('start');
        },
        'click .stop': function () {
            Meteor.call('stop');
            Meteor.call('getBuySellData', 1, 0001);
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