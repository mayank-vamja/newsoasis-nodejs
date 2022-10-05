$(document).bind("fullscreenerror", function() {
    alert("Browser rejected fullscreen change");
});

$(document).ready(function() {
    $('.news-thumbnail').css('background', randomColor);
    $('.collapsible').collapsible();
    var randomColor = 'rgb(' + (Math.random() * 255) + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
});

function seeNews(i) {
    $.post("/", {i : i});
    window.location.replace("/show");
}

function viewStories() {
    $('.story-pb').addClass('indeterminate');
    $(document).fullScreen(true);
    window.location = "/stories";
}

function getNews(a) {
    console.log(a);
    $.post("/article", {data: a});
    window.location.replace("/article");
}