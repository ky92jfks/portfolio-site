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

    /* 表示領域の背景色変更 */
    const $bg = $('#bg-wrapper');

    $(window).on('scroll', function () {
      $('section').each(function () {
        const offsetTop = $(this).offset().top;
        const offsetBottom = offsetTop + $(this).outerHeight();
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        const center = scrollTop + windowHeight / 2;

        if (center >= offsetTop && center < offsetBottom) {
          const color = $(this).data('bg') || '#ffffff';
          $bg.css('background-color', color);
        }
      });
    });
});