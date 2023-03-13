var str = window.location.href;
var selectedNews = str.split('/').pop();
selectedNews = selectedNews.split('?')[0]

$(document).ready(function(){
    $('.modal').modal();
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.dropdown-trigger').dropdown();
    $('#autocomplete-input').autocomplete({data: {}});
    if(selectedNews == null || selectedNews == '') {
        $('#home').addClass('cat-select z-depth-1');
    } else {
        $('#' + selectedNews).addClass('cat-select z-depth-1');
    }

    var prevScrollpos = window.pageYOffset;
    $(window).scroll(function () {
        var currentScrollPos = window.pageYOffset;
        (prevScrollpos < currentScrollPos)
        ? $(".bottom-tab").css("bottom", "-70px")
        : $(".bottom-tab").css("bottom", "0px");
        prevScrollpos = currentScrollPos;
    });

});