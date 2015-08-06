ng-rollbar
==========

[Rollbar](https://rollbar.com/) integration for [AngularJS](https://angularjs.org/)

This library automatically loads rollbar.js in version `1.4.4`

Installation
------------

You can use [bower](http://bower.io/) to install this frontend dependency: `bower install ng-rollbar --save`

Or you can just clone this repo: `git clone https://github.com/tandibar/ng-rollbar.git`

Usage
-----

### Load

Add the library into your application:

    <script type="text/javascript" src="bower_components/ng-rollbar/ng-rollbar.min.js"></script>

Add the module as dependency to your angular app:

    angular.module('myApp', ['tandibar/ng-rollbar', ...])

### Initialize

Now initialize the rollbar in your application's config:

    myApp.config(function(RollbarProvider) {
      RollbarProvider.init({
        accessToken: "<YOUR-APPLICATION-TOKEN>",
        captureUncaught: true,
        payload: {
          environment: '<specify-your-env>'
        }
      });
    });

What you pass in via this init is exactly what you would do via the `_rollbarConfig` variable as described in the [Rollbar Docs](https://rollbar.com/docs/notifier/rollbar.js/). This call to `init` will trigger the inclusion of the Rollbar snippet in your application. So if you never trigger the `init` call, Rollbar will never track anything.

Now every exception will be tracked by Rollbar.

### Custom

If you need to manually trigger calls to Rollbar you can inject Rollbar where needed

    myApp.controller('MainCtrl', function($scope, Rollbar) {
      $scope.onSomeEvent = function() {
        Rollbar.error('this is an error with special handling');
      };
    });

You can enable/disable Rollbar via:

    Rollbar.disable();
    // ... things that should not be tracked by Rollbar ...
    Rollbar.enable();

and you can turn on verbosity:

    Rollbar.verbose(); // will log infos to console


Other exposed api calls (see [Rollbar Docs](https://rollbar.com/docs/notifier/rollbar.js/) for further usage infos)

    // Rollbar severities
    Rollbar.critical("some critical error");
    Rollbar.error("some error");
    Rollbar.warning("some warning");
    Rollbar.info("some info");
    Rollbar.debug("some debug message");

    // Rollbar config
    Rollbar.configure(<new-config>);

    // Rollbar scope
    Rollbar.scope();

And if anything is missing you can access the original Rollbar object via

    Rollbar.Rollbar // access original Rollbar instance


How it works
------------

The library decorates angulars `$exceptionHandler` with a call to `Rollbar.error` with the catched exception and the cause.


License
----

Released under the terms of MIT License:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
