$(document).ready(function() {
    $(window).scroll(function (e) {
        e.preventDefault();
        var windowScrollTop, windowOuterHeight, bodyHeight;
        windowScrollTop = $(window).scrollTop();
        windowOuterHeight = $(window).outerHeight();
        bodyHeight = $(document).height();
        var total = (windowScrollTop / (bodyHeight - windowOuterHeight)) * 100;
        $(".determinate").width(total + "%");
    });
});
