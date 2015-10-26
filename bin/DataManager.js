/**
 * Created by matan on 26/10/15.
 */
var https = require('https');
var parseString = require('xml2js').parseString;
var xml = 'https://data.gov.il//sites/data.gov.il/files/xml/imslasthour.xml';

module.exports.getJson = function(req, res){
    https.get(xml, function (response){
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            parseString(body, function(err, result){
                if(err){
                    console.log(err);
                    res.status(500).send('err');
                }
                else{
                    res.status(200).send(result);
                }
            });
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        res.status(500).send(e.message);
    });
};