var request = require("request")
var logger = require('./app/logger');

var slides_url = "http://slide.meguro.ryuzee.com/api/v1/slides";
var slide_url = "http://slide.meguro.ryuzee.com/api/v1/slide";
var iframe_url = "http://slide.meguro.ryuzee.com/slides/iframe";

(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  /** Lazy load for script **/
  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var code = elem.text();
          var f = new Function(code);
          f();
        }
      }
    };
  });

  /** Set appropriate iframe height **/
  app.directive('iframeSetDimensionsOnload', [function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        element.on('load', function(){
          element.css('height', 0);
          var iFrameWidth = '100%';
          var iFrameHeight = element[0].contentWindow.document.body.scrollHeight + 'px';
          logger.request.debug("iFrameHeight:" + String(iFrameHeight));
          element.css('width', iFrameWidth);
          element.css('height', iFrameHeight);
        })
      }
    }
  }]);
}(angular));

/** Service Layer **/
angular.module('myServices', [])
  .service('oss', ['$http', function ($http) {

    /** Retrieve Slides json **/
    this.get_slides = function (callback) {
      $http({
        url: slides_url,
        method: 'GET'
      })
      .success(function (data, status, headers, config) {
        callback(data);
      })
      .error(function (data, status, headers, config) {
        alert(status + ' ' + data.message);
      });
    };

    /** Retrieve Slides json by tag **/
    this.get_slides_by_tag = function (tag, callback) {
      $http({
        url: slides_url + "/tag:" + tag,
        method: 'GET'
      })
      .success(function (data, status, headers, config) {
        callback(data);
      })
      .error(function (data, status, headers, config) {
        alert(status + ' ' + data.message);
      });
    };

    this.get_slides_by_keyword = function (keyword, callback) {
      $http({
        url: slides_url + "/name:" + keyword,
        method: 'GET'
      })
      .success(function (data, status, headers, config) {
        callback(data);
      })
      .error(function (data, status, headers, config) {
        alert(status + ' ' + data.message);
      });
    };


    /** Retrieve specific slide **/
    this.get_slide = function (id, callback) {
      logger.request.debug("Slide ID is " + String(id));
      $http({
        url: slide_url + "/" + String(id),
        method: 'GET'
      })
      .success(function (data, status, headers, config) {
        callback(data);
      })
      .error(function (data, status, headers, config) {
        logger.request.error("Slide URL is " + slide_url + "/" + String(id));
        alert(status + ' ' + data.message);
      });
    };

    /** Retrieve specific transcript **/
    this.get_transcript = function (id, callback) {
      logger.request.debug("[Info] Slide ID is " + String(id));
      $http({
        url: slide_url + "/" + String(id) + "/transcript",
        method: 'GET'
      })
      .success(function (data, status, headers, config) {
        callback(data);
      })
      .error(function (data, status, headers, config) {
        alert(status + ' ' + data.message);
      });
    };
  }]);

/** Main **/
angular.module('OSS', ['myServices', 'ngSanitize', 'ngLoadScript'])
.controller('SlidesController',
  ['$scope', 'oss', '$sce', '$timeout', function($scope, oss, $sce, $timeout) {
    oss.get_slides(function (res) {
      $scope.slides = res;
    });
    $scope.displaySlide = function(id, $event) {
      /** Display main tab **/
      $timeout(function() {
        angular.element('#main_menu').trigger('click');
      }, 1);

      /** Specify frame url **/
      logger.request.debug("Slide ID is " + String(id));
      var u = iframe_url + "/" + String(id);
      $scope.src = u;
      logger.request.debug("Slide Frame is " + $scope.src);
      $scope.src = $sce.trustAsResourceUrl($scope.src);
      $scope.slide_transcript_data = null;

      /** Retrieve slide data **/
      oss.get_slide(id, function (res) {
        logger.request.debug("Success to get slide...");
        $scope.slide_data = res;
        $scope.slide_body = "./templates/slide_body.html";
      });

      /** Retrieve transcript data **/
      oss.get_transcript(id, function (res) {
        logger.request.debug("Success to get transcript...");
        $scope.slide_transcript_data = res;
        $scope.slide_transcript = "./templates/slide_transcript.html";
      });
    };
    $scope.listSlidesByTag = function(tag, $event) {
      oss.get_slides_by_tag(tag, function(res) {
        logger.request.debug(res);
        $scope.slides = res;
      });
    };
    $scope.listAllSlides = function(tag, $event) {
      oss.get_slides(function(res) {
        $scope.slides = res;
      });
    };
    $scope.onSearchTextChange = function($event) {
      var t = $scope.search_text;
      oss.get_slides_by_keyword(t, function(res) {
        $scope.slides = res;
      });
    };
  }]
);

// vim: ts=2 sts=2 sw=2 expandtab
