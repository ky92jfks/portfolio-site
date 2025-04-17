$(function(){
  /* ページ内スクロール */
  $('a[href^="#"]').click(function(){
    //スクロールのスピード
    var speed = 500;
    //リンク元を取得
    var href= $(this).attr("href");
    //リンク先を取得
    var target = $(href == "#" || href == "" ? 'html' : href);
    //リンク先までの距離を取得
    var position = target.offset().top;
    //スムーススクロール
    $("html, body").animate({ scrollTop: position }, speed, "swing", function () {
      updateBackgroundGradient(); // ← スクロール完了後に1回実行
    });    
    return false;
  });

  /* グラデーション背景のふわっと切り替え */
  let $current = $('#bg-wrapper .current');
  let $next = $('#bg-wrapper .next');
  let currentGradient = '';
  let isTransitioning = false; // ← 切り替え中かどうかのフラグ

  function updateBackgroundGradient() {
    if (isTransitioning) return; // ← 切り替え中なら何もしない

    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const center = scrollTop + windowHeight / 2;

    $('section').each(function () {
      const offsetTop = $(this).offset().top;
      const offsetBottom = offsetTop + $(this).outerHeight();

      if (center >= offsetTop && center < offsetBottom) {
        const colorStart = $(this).data('gradient-start') || '#ffffff';
        const colorEnd = $(this).data('gradient-end') || '#ffffff';
        const newGradient = `linear-gradient(135deg, ${colorStart}, ${colorEnd}, ${colorStart})`;

        if (newGradient !== currentGradient) {
          currentGradient = newGradient;
          isTransitioning = true; // ← 切り替え開始

          // 新しい背景を next にセット
          $next.css({ backgroundImage: newGradient });

          // フェード切り替え
          $next.stop(true).animate({ opacity: 0.7 }, 200);
          $current.stop(true).animate({ opacity: 0 }, 200, function () {
            // クラスと参照を入れ替え
            $current.removeClass('current').addClass('next');
            $next.removeClass('next').addClass('current');

            // セレクタをスワップ
            const tmp = $current;
            $current = $next;
            $next = tmp;

            isTransitioning = false; // ← 切り替え完了
          });
        }
      }
    });
  }

  // スクロール停止を検知してグラデ変更（debounce）
  let scrollTimeout;
  $(window).on('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateBackgroundGradient, 50); // スクロール停止から100ms後に実行
  });

  // 初回実行
  updateBackgroundGradient();
});
