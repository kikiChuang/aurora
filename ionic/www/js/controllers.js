angular.module('aurora.controllers', [])

.controller('DashCtrl', function($scope, $kpAPI, $ionicPlatform, $background) {
    $scope.forecast = $kpAPI.getForecast();

    var checkKpNow = function() {
        if(!$scope.forecast.now)
            $scope.forecast.now = 0;
    };

    var viewportHeight = window.innerHeight;
    if(viewportHeight > 300)
    {
        var kpnow = document.getElementById("kp-now");
        kpnow.style.height = viewportHeight/2 + "px";
        kpnow.style.lineHeight = viewportHeight/2 + "px";
        kpnow.style.fontSize = viewportHeight/2 + "px";
    }


    window.onresize = function() {
        var viewportHeight = window.innerHeight;
        if(viewportHeight > 300)
        {
            var kpnow = document.getElementById("kp-now");
            kpnow.style.height = viewportHeight/2 + "px";
            kpnow.style.lineHeight = viewportHeight/2 + "px";
            kpnow.style.fontSize = viewportHeight/2 + "px";
        }
    };

    $scope.backgroundurl = $background.getBackground();

    $ionicPlatform.on('resume', function() {
        $scope.forecast = $kpAPI.getForecast();
        $scope.backgroundurl = $background.getBackground();
    });
})

.controller('SettingsCtrl', function($scope, $localstorage, $ionicPopover, $push, $geolocation, $background, $ionicPlatform, ionicTimePicker) {
    $scope.loadDefaults = function() {
        $scope.alerts    = true;
        $scope.kpTrigger = 1;
        $scope.daytime   = false;
        $scope.gps       = false;
        $scope.zip       = 90210;
    };

    $scope.loadSettings = function() {
        $scope.alerts    = $localstorage.get('alerts');
        $scope.kpTrigger = $localstorage.get('kpTrigger');
        $scope.daytime   = $localstorage.get('daytime');
        $scope.gps       = $localstorage.get('gps');
        $scope.zip       = $localstorage.get('zip');

        if (typeof $scope.alerts == 'undefined') {
            $scope.loadDefaults();
            $scope.saveAllSettings();
        }
    };

    $scope.saveAllSettings = function() {
        $localstorage.set('alerts', $scope.alerts);
        $localstorage.set('kpTrigger', $scope.kpTrigger);
		$localstorage.set('daytime', $scope.daytime);
        $localstorage.set('gps', $scope.gps);
        $localstorage.set('zip', $scope.zip);
    };

    $scope.outputSettings = function(asAlert) {
        data = {'alerts' : $scope.alerts,
                'kpTrigger' : $scope.kpTrigger,
				'daytime' : $scope.daytime,
                'gps' : $scope.gps,
                'zip' : $scope.zip};

        if(asAlert)
            alert(data);
        else
            console.log(data);
    };

    $scope.requestPush         = function() {
        $push.requestTestPushNotification();
    };

    $scope.initPush            = function() {
        $push.initPushNotifications();
    };

    $scope.unregisterPush      = function() {
        $push.unregister();
    };

    $scope.changeKpTrigger     = function(kpTrigger) {
        $localstorage.set('kpTrigger', kpTrigger);
        $push.changeKpTrigger(kpTrigger);
    };

    $scope.showGeoLocationInfo = function() {
        $geolocation.showGeoLocationInfo();
    };

    $scope.geolocationToggled = function() {
        $scope.gps = !$localstorage.get('gps');
        $localstorage.set('gps', $scope.gps);
        console.log('AURORA: GPS toggled!');
    };

    $scope.alertsToggled = function() {
        $scope.alerts = !$localstorage.get('alerts');
        $localstorage.set('alerts', $scope.alerts);
        console.log('AURORA: Alerts toggled!');

        if($scope.alerts) {
            $scope.initPush();
        }
        else {
            $scope.unregisterPush();
        }
    };

    $scope.loadSettings();
    $scope.outputSettings(false);
	$scope.backgroundurl = $background.getBackground();
	$scope.time1 =
	{
		'hours' : "08",
		'minutes' : "00",
		'half' : "AM",
		'epoch' : 28800
	}
	$scope.time2 =
	{
		'hours' : "08",
		'minutes' : "00",
		'half' : "PM",
		'epoch' : 72000
	}
	
	$scope.timeWindow = function(timeObj)
	{		
		var time = {
			callback: function (val) {      //Mandatory
				if (typeof (val) === 'undefined') {
					console.log('Time not selected');
				} else {
					var selectedTime = new Date(val * 1000);
					console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
					
					//Store value for loading window again
					timeObj.epoch = val;
					
					//AM vs PM
					if(selectedTime.getUTCHours()>12)
						timeObj.half = "PM";
					else
						timeObj.half = "AM";
					
					//Hours
					var hour = (selectedTime.getUTCHours()%12);
					if (selectedTime.getUTCHours() == 0 )
					{
						hour = 12;
						timeObj.half = "PM";
					}
					
					if (selectedTime.getUTCHours() == 12)
					{
						hour = 12;
						timeObj.half = "AM";
					}
					
					$scope.time.hours = hour.toString();
					if(timeObj.length < 2)
					{
						var temp = $scope.time.hours;
						timeObj.hours = "0" + temp;
					}
					
					//Minutes 
					var min = selectedTime.getUTCMinutes();
					$scope.time.minutes = min.toString();
					if(timeObj.minutes.length < 2)
					{
						var temp = timeObj.minutes;
						timeObj.minutes = "0" + temp;
					}	
				}
			},
			inputTime: timeObj.epoch
		};
		ionicTimePicker.openTimePicker(time);
	}

    $ionicPlatform.on('resume', function() {
        $scope.backgroundurl = $background.getBackground();
    });
})

.controller('AboutCtrl', function($scope, $background, $ionicPlatform) {
    $scope.backgroundurl = $background.getBackground();
    $ionicPlatform.on('resume', function() {
        $scope.backgroundurl = $background.getBackground();
    });
})

.controller('FeedbackCtrl', function($scope, $background, $ionicPlatform) {
    $scope.backgroundurl = $background.getBackground();
    $ionicPlatform.on('resume', function() {
        $scope.backgroundurl = $background.getBackground();
    });
})

.controller('AllskyCtrl', function($scope, $background, $ionicPlatform) {
	$scope.backgroundurl = $background.getBackground();
    $ionicPlatform.on('resume', function() {
        $scope.backgroundurl = $background.getBackground();
    });
});
