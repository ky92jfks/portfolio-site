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
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });

  /* グラデーション背景のふわっと切り替え */
  const $bgWrapper = $('#bg-wrapper');

  // レイヤーを2つ用意
  const $layer1 = $('<div class="bg-layer"></div>').appendTo($bgWrapper);
  const $layer2 = $('<div class="bg-layer"></div>').appendTo($bgWrapper);

  let currentLayer = $layer1;
  let currentGradient = '';

  function updateGradient() {
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

        // 同じグラデーションだったら何もしない
        if (newGradient === currentGradient) return;

        const nextLayer = (currentLayer === $layer1) ? $layer2 : $layer1;
        nextLayer.css({
          'background-image': newGradient,
        });

        // 先にactiveを付けて、少し後で前のを消す（アニメーションを確実に効かせる）
        nextLayer.addClass('active');
        currentLayer.removeClass('active');

        currentLayer = nextLayer;
        currentGradient = newGradient;

        return false; // 一致したらループ止める
      }
    });
  }

  // スクロール時のグラデーション更新
  $(window).on('scroll', updateGradient);

  // ページ読み込み時に1回実行
  updateGradient();


});