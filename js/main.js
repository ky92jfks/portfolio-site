$(function(){
  // 背景図形
  // SVG定義
  const flowerSVG = `<svg viewBox="0 0 445 500"><path d="M222.501 0C259.094 0.000335493 301.508 48.7693 308.466 101.102C357.266 80.9601 420.71 93.3089 439.007 125C457.303 156.691 436.275 217.808 394.432 250C436.275 282.191 457.303 343.309 439.007 375C420.71 406.691 357.266 419.039 308.466 398.897C301.509 451.23 259.094 500 222.501 500C185.907 500 143.49 451.23 136.533 398.897C87.7329 419.038 24.2907 406.691 5.99392 375C-12.3028 343.309 8.72446 282.192 50.5672 250C8.7245 217.808 -12.3028 156.691 5.99392 125C24.2907 93.3093 87.733 80.9609 136.533 101.102C143.49 48.769 185.907 0 222.501 0Z" fill="#FF85A0"/></svg>`;
  const starSVG = `<svg viewBox="0 0 500 500"><path d="M243.26 12.3592C246.169 7.02377 253.831 7.02375 256.74 12.3592L326.137 139.606C327.241 141.63 329.197 143.052 331.464 143.476L473.927 170.155C479.9 171.273 482.268 178.559 478.093 182.975L378.519 288.296C376.934 289.972 376.187 292.272 376.484 294.559L395.135 438.294C395.917 444.32 389.719 448.823 384.229 446.217L253.292 384.063C251.209 383.074 248.791 383.074 246.708 384.063L115.771 446.217C110.281 448.823 104.083 444.32 104.865 438.294L123.516 294.559C123.813 292.272 123.066 289.972 121.481 288.296L21.9073 182.975C17.7322 178.559 20.0995 171.273 26.073 170.155L168.536 143.476C170.803 143.052 172.759 141.63 173.863 139.606L243.26 12.3592Z" fill="#FFDDEA"/></svg>`;

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  // 図形生成関数
  function createFloatingShapes($targetContainer, countPerType = 3) {
    if (!$targetContainer || !$targetContainer.length) return;

    const shapeTypes = ['circle', 'square', 'triangle', 'flower', 'star'];

    shapeTypes.forEach(type => {
      for (let i = 0; i < countPerType; i++) {
        let $shape = $('<div>').addClass(`shape shape-${type} float-shape`);
        
        let size = getRandom(60, 300);
        let top = getRandom(10, 80);
        let left = getRandom(5, 85);
        let initialRotate = getRandom(0, 360);

        let floatSpeed = getRandom(0.0003, 0.0006); // 動きの周期
        let floatRadiusX = getRandom(20, 600); // 横方向の振れ幅
        let floatRadiusY = getRandom(20, 600); // 縦方向の振れ幅
        let floatOffset = getRandom(0, 1000); // 動きの開始位相

        $shape.data({
          'base-rotate': initialRotate,
          'float-speed': floatSpeed,
          'radius-x': floatRadiusX,
          'radius-y': floatRadiusY,
          'offset': floatOffset
        });

        $shape.css({
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`
        });

        if (type === 'flower') $shape.html(flowerSVG);
        if (type === 'star') $shape.html(starSVG);

        $targetContainer.append($shape);
      }
    });
  }

  // 2つのコンテナそれぞれに図形を動的挿入
  createFloatingShapes($('#shapeContainer'), 3);
  createFloatingShapes($('#globalShapeContainer'), 3);

  // スクロール加速度
  let scrollSpeed = 0;
  let lastScrollTop = $(window).scrollTop();

  $(window).on('scroll', function() {
    let st = $(window).scrollTop();
    scrollSpeed = (st - lastScrollTop) * 0.12;
    lastScrollTop = st;
  });

  // アニメーションループ
  function animateShapes() {
    scrollSpeed *= 0.92;
    const now = Date.now();

    $('.float-shape').each(function(index) {
      const speed = $(this).data('float-speed');
      
      // データ未設定の要素（手動配置要素等）はスキップ
      if (!speed) return;

      const baseRotate = $(this).data('base-rotate') || 0;
      const radiusX = $(this).data('radius-x') || 50;
      const radiusY = $(this).data('radius-y') || 50;
      const offset = $(this).data('offset') || 0;

      const time = now * speed + offset;

      let floatX = Math.cos(time) * radiusX;
      let floatY = Math.sin(time * 1.3) * radiusY;

      let accelY = scrollSpeed * (index % 2 === 0 ? 1.5 : -1.5);
      let totalY = floatY + accelY;

      // インラインの transform を確実に書き換え
      this.style.transform = `translate3d(${floatX}px, ${totalY}px, 0px) rotate(${baseRotate}deg)`;
    });

    requestAnimationFrame(animateShapes);
  }

  // アニメーションスタート
  animateShapes();

  // テーマ切り替えボタンのクリックイベント
  $('#themeToggle').on('click', function() {
    $('#main-visual').toggleClass('dark-mode');
  });

  // メニュー・スクロール関連処理
  $('.sp_menu-button').on('click', function() {
    hamburger();
  });

  $('nav a').on('click', function() {
    hamburger();
  });

  $('a[href^="#"]').click(function(){
    var speed = 600;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $("html, body").animate({ scrollTop: position }, speed, "swing", function () {
      updateBackgroundGradient();
    });    
    return false;
  });

  // グラデーション背景のふわっと切り替え
  let $bgWrapper = $('#bg-wrapper');
  let $current = $('#bg-wrapper .current');
  let $next = $('#bg-wrapper .next');
  let currentGradient = '';
  let isTransitioning = false;

  function updateBackgroundGradient() {
    if (isTransitioning) return;

    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const center = scrollTop + windowHeight / 2;

    $('section').each(function () {
      const offsetTop = $(this).offset().top;
      const offsetBottom = offsetTop + $(this).outerHeight();

      if (center >= offsetTop && center < offsetBottom) {
        const sectionId = $(this).attr('id');
        const colorStart = $(this).data('gradient-start');
        const colorEnd = $(this).data('gradient-end');

        if (sectionId === 'main-visual' || sectionId === 'works' || !colorStart || !colorEnd) {
          $bgWrapper.stop(true).animate({ opacity: 0 }, 300);
          return;
        } else {
          $bgWrapper.stop(true).animate({ opacity: 0.35 }, 300);
        }

        const newGradient = `linear-gradient(135deg, ${colorStart}, ${colorEnd}, ${colorStart})`;

        if (newGradient !== currentGradient) {
          currentGradient = newGradient;
          isTransitioning = true;

          $next.css({ backgroundImage: newGradient });

          $next.stop(true).animate({ opacity: 0.7 }, 200);
          $current.stop(true).animate({ opacity: 0 }, 200, function () {
            $current.removeClass('current').addClass('next');
            $next.removeClass('next').addClass('current');

            const tmp = $current;
            $current = $next;
            $next = tmp;

            isTransitioning = false;
          });
        }
      }
    });
  }

  let scrollTimeout;
  $(window).on('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateBackgroundGradient, 50);
  });

  updateBackgroundGradient();
});

// ハンバーガーメニューボタン処理(メニュー・スクロール関連処理)
function hamburger() {
  $('.sp_menu-button_position').toggleClass('active');
  $('.sp_menu-button').toggleClass('active');
  $('.navigation-cover').toggleClass('active');
  $('#main-visual').toggleClass('hidden');
}