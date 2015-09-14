var request = require("request")
var logger = require('./app/logger');

var base_url = "http://slide.meguro.ryuzee.com";
var slides_url = base_url + "/api/v1/slides";
var slide_url = base_url + "/api/v1/slide";
var iframe_url = base_url + "/slides/iframe";

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
angular.module('OSSServices', [])
  .service('oss', ['$http', function ($http) {

    /** Common function to retrieve data from specific url **/
    this.get_data = function(url, callback) {
      $http({
        url: url,
        method: 'GET'
      })
      .success(function (data, status, headers, config) {
        callback(data);
      })
      .error(function (data, status, headers, config) {
        var e = "Error occured...";
        if(status == "0") {
          e = "Failed to retrieve data...";
        } else if(status == "404") {
          e = "404 Not Found...";
        }
        alert(e);
      });
    };

    /** Retrieve Slides json **/
    this.get_slides = function (callback) {
      var u = slides_url;
      this.get_data(u, callback);
    };

    /** Retrieve Slides json by tag **/
    this.get_slides_by_tag = function (tag, callback) {
      var u = slides_url + "/tags:" + tag;
      this.get_data(u, callback);
    };

    this.get_slides_by_keyword = function (keyword, callback) {
      var u = slides_url + "/name:" + keyword;
      this.get_data(u, callback);
    };

    /** Retrieve specific slide **/
    this.get_slide = function (id, callback) {
      var u = slide_url + "/" + String(id);
      this.get_data(u, callback);
    };

    /** Retrieve specific transcript **/
    this.get_transcript = function (id, callback) {
      var u = slide_url + "/" + String(id) + "/transcript";
      this.get_data(u, callback);
    };
  }]);

/** Main **/
angular.module('OSS', ['OSSServices', 'ngSanitize', 'ngLoadScript'])
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
