
var create_team = function(name, members_array) {
    var postData = {
        data : {
            name : name,
            members : members_array,
            cash : 1000000.0
        }
    };

    var response = HTTP.post('http://cis2016-teamtracker.herokuapp.com/api/teams', postData, function( error, response ) {

        if (error) {
            console.log(error);
        } else {
            console.log(response);
        }
    });
};

var validate_team = function(uid) {

    var response = HTTP.get('http://cis2016-teamtracker.herokuapp.com/api/teams/validate/' + uid);
    console.log(response.data);

};