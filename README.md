ng-rollbar
==========

[Rollbar](https://rollbar.com/) integration for [AngularJS](https://angularjs.org/)

Since version `1.7.2` the version of `ng-rollbar` equals the official [rollbar.js](https://github.com/rollbar/rollbar.js/) version. So if you
install `1.8.0` of this library you will get `rollbar.js` in version `1.8.0`.

Before that:
- `0.5.0` means rollbar.js in version `v1.7.0`
- `0.4.0` for rollbar.js in version `1.5.0`
- `0.3.1` for rollbar.js in version `1.4.4`

Installation
------------

You can use [bower](http://bower.io/) to install this frontend dependency: `bower install ng-rollbar --save`

Or you can just clone this repo: `git clone https://github.com/tandibar/ng-rollbar.git`

Usage
-----

### Load

Add the library into your application:

```html
<script type="text/javascript" src="bower_components/ng-rollbar/ng-rollbar.min.js"></script>
```

Add the module as dependency to your angular app:

```javascript
angular.module('myApp', ['tandibar/ng-rollbar', ...])
```

### Initialize

Now initialize the rollbar in your application's config:

```javascript
myApp.config(['RollbarProvider', function(RollbarProvider) {
  RollbarProvider.init({
    accessToken: "<YOUR-APPLICATION-TOKEN>",
    captureUncaught: true,
    payload: {
      environment: '<specify-your-env>'
    }
  });
}]);
```

What you pass in via this init is exactly what you would do via the `_rollbarConfig` variable as described in the [Rollbar Docs](https://rollbar.com/docs/notifier/rollbar.js/). This call to `init` will trigger the inclusion of the Rollbar snippet in your application. So if you never trigger the `init` call, Rollbar will never track anything.

Now every exception will be tracked by Rollbar.

### Do not load

If you are developing Apps which sometimes get deployed in an environment without
internet access (yes, theses places still exist) than you might want to disable
the whole loading process of rollbar:

```javascript
myApp.config(function(RollbarProvider) {
  RollbarProvider.deinit();
});
```

Now whenever you call a Rollbar function you will just get a log message and no
script will be loaded.

### Custom

If you need to manually trigger calls to Rollbar you can inject Rollbar where needed

```javascript
myApp.controller('MainCtrl', function($scope, Rollbar) {
  $scope.onSomeEvent = function() {
    Rollbar.error('this is an error with special handling');
  };
});
```

You can enable/disable Rollbar via:

```javascript
Rollbar.disable();
// ... things that should not be tracked by Rollbar ...
Rollbar.enable();
```

and you can turn on verbosity:

```javascript
Rollbar.verbose(); // will log infos to console
```

Other exposed api calls (see [Rollbar Docs](https://rollbar.com/docs/notifier/rollbar.js/) for further usage infos)

```javascript
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
```

And if anything is missing you can access the original Rollbar object via

```javascript
Rollbar.Rollbar // access original Rollbar instance
```

### Eventing & Callbacks

Since Angular 1.x decorators cannot specify order of execution, handling the results of the Rollbar request (such as fetching the UUID to hand-off to Customer Service) relies on the Angular eventing system. Whenever an exception is caught and handled by Rollbar, a `rollbar:exception` event will be emitted on `$rootScope`.

This provides easy access to the Rollbar API response:

```javascript
    angular.service('MyErrorListener', function($rootScope) {
        this.initialize = function() {
            $rootScope.$on('rollbar:exception', function(event, response) {
                // custom logic here...
            });
        }
    });
```

The `event` parameter in the listener is the representation of the Angular event. The `response` object contains the following items:

* `exception` - The exception that was caught and logged to Rollbar
* `data` - The data sent back from Rollbar
* `err` - Error information if the Rollbar request failed

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
