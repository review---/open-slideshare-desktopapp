var request = require("request")
var slides_url = "http://slide.meguro.ryuzee.com/api/v1/slides";
var slide_url = "http://slide.meguro.ryuzee.com/api/v1/slide";
var iframe_url = "http://slide.meguro.ryuzee.com/slides/iframe";


(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var code = elem.text();
          console.log(code);
          var f = new Function(code);
          f();
        }
      }
    };
  });

  app.directive('iframeSetDimensionsOnload', [function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        element.on('load', function(){
          var iFrameHeight = element[0].contentWindow.document.body.scrollHeight + 'px';
          var iFrameWidth = '100%';
          element.css('width', iFrameWidth);
          element.css('height', 0);
          element.css('height', iFrameHeight);
        })
      }
    }}]
  );

}(angular));

angular.module('myServices', [])
.service('oss', ['$http', function ($http) {
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
    this.get_slide = function (id, callback) {
        console.log(id);
        $http({
            url: slide_url + "/" + String(id),
            method: 'GET'
        })
        .success(function (data, status, headers, config) {
            callback(data);
        })
        .error(function (data, status, headers, config) {
            console.log(slide_url + "/" + String(id));
            alert(status + ' ' + data.message);
        });
    };
}]);

angular.module('OSS', ['myServices', 'ngSanitize', 'ngLoadScript'])
    .controller('SlidesController',
        ['$scope', 'oss', '$sce', function($scope, oss, $sce) {
            $scope.hoge = "doing...";
            oss.get_slides(function (res) {
                $scope.slides = res;
            });
            $scope.displaySlide = function(id, $event) {
                console.log(id);
                var u = iframe_url + "/" + String(id);
                $scope.src = u;
                console.log($scope.src);
                $scope.src = $sce.trustAsResourceUrl($scope.src);
                oss.get_slide(id, function (res) {
                    $scope.slide_data = res;
                    console.log($scope.slide_data);
                });
                $scope.slide_body = "./templates/slide_body.html";
            };
        }]
    );
