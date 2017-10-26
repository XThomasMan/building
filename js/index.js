var res = [
  './img/bg-index.jpg',
  './img/sprites-loading.png',
  './img/sprites-building.png',
  './img/sprites-index.png',
  './img/building/1.png',
  './img/building/2.png',
  './img/building/3.png',
  './img/building/4.png',
  './img/building/5.png',
  './img/building/6.png',
  './img/building/7.png',
  './img/building/8.png',
  './img/building/9.png',
  './img/building/10.png',
  './img/building/11.png',
  './img/building/12.png',
  './img/building/13.png',
  './img/building/14.png',
  './img/building/15.png',
  './img/building/16.png',
  './img/building/17.png',
  './img/building/18.png',
  './img/building/19.png',
  './img/building/20.png',
  './img/building/21.png',
  './img/building/22.png',
  './img/building/23.png',
  './img/building/24.png'
];
var IndexPage = function () {
  this.init();
};

IndexPage.prototype = {
  stopVideo: false,
  init: function () {
    this.loading();
    this.initVideo();
  },
  initVideo: function () {
    var video = this.video = document.getElementById("video");
    var videoH = 960;
    var videoW = 544;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var videoRatio = videoH / videoW;
    if (height / width > videoRatio) {
      video.height = height;
    } else {
      video.width = width;
      var lHeight = videoH * width / videoW;
      var lessH = height - lHeight;
      video.style.WebkitTransform = "translate(0, " + lessH + "px)";
    }
  },
  videoStart: function (index) {
    var self = this;
    var video = this.video;
    video.play();
    self.stopVideo = false;
    video.ontimeupdate = function () {
      !self.stopVideo && $(video).addClass("active");
    };
  },
  loading: function () {
    var self = this;
    new mo.Loader(res, {
      loadType: 1,
      minTime: 300,
      onLoading: function (count, total) {
        var progress = parseInt(count / total * 100);
        $('#percent').html(progress + '%');
      },
      onComplete: function () {
        $('#progress').addClass('cm-hide');
        self.beginAnimation();
        // $('#loading').addClass('active');
        // self.bindEvents();
        self.threeSixtyRun();
      }
    });
  },
  beginAnimation: function () {
    $('.loading, .loading-dialog, .loading-question, .loading-building, .loading-desc, .loading-arrow, .star').addClass('transition');
    this.showDialog();
    this.runStar();
  },
  showDialog: function () {
    var self = this;
    var $dialog1 = $('#dialog1');
    var $dialog2 = $('#dialog2');
    var $dialog3 = $('#dialog3');

    function end(callback) {
      return function () {
        setTimeout(callback, 1000);
      }
    }

    $dialog1.addClass('show').one('webkitTransitionEnd', end(function () {
      $dialog2.addClass('show');
      $dialog1.removeClass('show').addClass('up').one('webkitTransitionEnd', end(function () {
        $dialog3.addClass('show');
        $dialog2.removeClass('show').addClass('up');
        $dialog1.removeClass('up').addClass('up2').one('webkitTransitionEnd', end(function () {
          $dialog1.removeClass('up2').addClass('out');
          $dialog2.removeClass('up').addClass('out');
          $dialog3.removeClass('show').addClass('out');
          self.showBuilding();
        }))
      }))
    }));
  },
  runStar: function () {
    $('.star').addClass('active').on('webkitTransitionEnd', function () {
      $(this).removeClass('active');
    });
  },
  showBuilding: function () {
    var self = this;
    $question = $('#question');
    $building = $('.loading-building');
    $building1 = $('#building1');
    $desc = $('.loading-desc');
    $arrow = $('#arrow');
    $question.addClass('active').one('webkitTransitionEnd', function () {
      $building.addClass('active');
      $building1.one('webkitTransitionEnd', function () {
        $desc.addClass('active').one('webkitTransitionEnd', function () {
          $arrow.addClass('active');
          self.bindEvents();
        });
      });
    });
  },
  setPoint: function (index) {
    $('.point').each(function () {
      var eq = $(this).data('index');
      this.className = 'point point-' + eq + (!!index ? ' point-' + eq + '-' + index : '');
    });
  },
  threeSixtyRun: function () {
    var self = this;
    var startIndex = 0;
    window.threeSixty = $('#product').ThreeSixty({
      totalFrames: 24, // Total no. of image you have for 360 slider
      currentFrame: 1, // This the start frame for auto spin
      imgList: '.threesixty_images', // selector for image list
      progress: '.spinner', // selector to show the loading progress
      imagePath: 'img/building/', // path of the image assets
      ext: '.png', // extention for the assets
      height: 361,
      width: 234,
      speed: 0.0001,
      direction: 0,
      navigation: false,
      disableSpin: false, // Default false
      onReady: function () {
        self.setPoint(1);
      },
      onDragStart: function (i) {
        startIndex = i;
      },
      onDragMove: function (i) {
        $('#guide').addClass('cm-hide');
        self.setPoint();
      },
      onDragStop: function (i, e) {
        var index = i % 24;
        var target = e.target;
        var className = target.className;
        var noMove = startIndex === i;
        index = index >= 0 ? index + 1 : 25 - Math.abs(index);
        self.setPoint(index);
        if (className.indexOf('point') > -1 && noMove) {
          var eq = $(target).data('index');
          self.videoStart(eq);
        }
      }
    });
  },
  bindEvents: function () {
    var self = this;
    var video = this.video;
    $(document).on('touchmove', function (e) {
      e.preventDefault();
    });
    $('#loading').on('swipeUp touchend', function () {
      $(this).addClass('active');
      setTimeout(self.runStar, 800);
    });
    $('#btn').on('touchend', function (e) {
      e.stopPropagation();
      $(this).parent().addClass('active').one('webkitAnimationEnd', function () {
        $(this).removeClass('active');
        //跳转页面
        window.location.href = 'end.html';
      });
    });
    video.addEventListener("ended", function (evt) {
      $(video).removeClass("active");
    });
    $(video).on('touchend', function (e) {
      e.stopPropagation();
      $(video).removeClass("active");
      self.stopVideo = true;
      this.load();
      return false;
    });
  }
};

new IndexPage();