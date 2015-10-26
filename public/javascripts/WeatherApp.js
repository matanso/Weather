/**
 * Created by matan on 26/10/15.
 */


var app = angular.module('WeatherApp', ['angular-loading-bar']);
app.controller('WeatherController', ['$scope', '$http', function($scope, $http){
    $scope.text = 'wait...';
    $scope.station = '';
    $http.get('/json').then(
        function success(response){
            var data = response.data.RealTimeData;
            var heb = data.HebrewVariablesNames[0];
            var observations = data.Observation;
            var current_obs = [];
            $scope.loaded = true;
            $scope.text = '';
            $scope.change_station = function(station){
                get_observations(observations, station, function(err, result){
                    current_obs = result;
                    $scope.times = [];
                    current_obs.forEach(function(obs){
                        $scope.times.push(obs.time_obs[0]);
                        if(obs.time_obs[0] == $scope.time){
                            $scope.change_time($scope.time);
                        }
                    });
                })
            };
            $scope.change_time = function(time) {
                var cnt = current_obs.length;
                current_obs.forEach(function(obs){
                    if(obs.time_obs[0] == time){
                        get_values(heb, obs, function(err, result){
                            if(!err){
                                $scope.observe = result;
                            }
                        })
                    }
                    else{
                        cnt--;
                    }
                    if(!cnt){
                        $scope.observe = {};
                    }
                })
            };
            get_stn_names(observations, function(err, result){
                if(!err)
                {
                    $scope.stations = result;
                    console.log(result);
                }
            })
        },
        function err(response){
            console.log("Failureeeee");
            $scope.text = 'an error occurred.'
        }
    );
}]);

function get_values(heb, curr_observe, callback){
    heb['stn_name'] = 'שם תחנה';
    heb['time_obs'] = 'זמן';
    heb['stn_num'] = 'מספר תחנה';
    var result = {};
    var keys = Object.keys(curr_observe);
    var cnt = keys.length;
    console.log(keys);
    keys.forEach(function(key){
        if(curr_observe.hasOwnProperty(key) && curr_observe[key][0])
        {
            result[heb[key] || key] = curr_observe[key][0];
        }
        cnt--;
        if(!cnt){
            callback(null, result);
        }
    });
}

function get_stn_names(data, callback){
    var cnt = data.length;
    var result = new Set();
    data.forEach(function(observe){
        cnt--;
        result.add(observe.stn_name[0]);
        if(!cnt){
            callback(null, Array.from(result));
        }
    });
}

function get_observations(observations, station, callback){
    var cnt = observations.length;
    var result = [];
    observations.forEach(function(observe){
        cnt--;
        if(observe.stn_name[0] == station){
            result.push(observe);
        }
        if(!cnt){
            callback(null, result);
        }
    });
}