Posts = new Mongo.Collection('posts');

//loops
if (Meteor.isServer) {
    Meteor.publish('market', function (market) {
        try {
            var response = HTTP.get('http://cis2016-exchange1.herokuapp.com/api/market_data/');
            console.log(response.data);

            _.each(response.data, function (item) {
                console.log(item);

                var listing = {
                    symbol: item.symbol,
                    time: item.time,
                    bid: item.bid,
                    ask: item.ask
                };

            });

        } catch (error) {
            console.log("error:" + error);
        }
        this.ready();

    });
}

if (Meteor.isClient) {
    var marketData = Meteor.subscribe('market');
    console.log(marketData);
}
/*
 Session.setDefault('market', 'all');

 Tracker.autorun(function() {
 if (Session.get('subreddit')) {
 var searchHandle = Meteor.subscribe('subredditSearch', Session.get('subreddit'));
 }
 });
 */