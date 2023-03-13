var anim;

$(document).ready(function(){

    // try {
    //     $(document).fullScreen(true);
    // } catch(err) {
    //     console.log("ERROR TO FULLSCREEN");
    // }

    timeLine();

    $('.news-view').swipe({
        swipeDown:function(event, direction, distance, duration, fingerCount) {
            swipeDownAnimate();
            window.location.replace('/');
        },
        swipeUp:function(event, direction, distance, duration, fingerCount) {
            $("#news-url-" + currentTab)[0].click();
        },
        swipeStatus:function(event, phase, direction, distance)
        {
            var str = "";
            if (phase=="end") {
                // str="Handler fired, you swiped";
                // console.log(str);
            }
        },
        threshold: 200
    });

    $('.tabs').tabs({
        swipeable : true,
        responsiveThreshold : 2920,
        duration: 0,
        onShow: function(){$(".tabs-content").css('height','100%');}
    });
    $('#next-page').css('left', '23px');
    $('#full-screen').css('left', 'calc(50% - 23px)');
    
    $('.news-view')
        .mouseup(function(){
            // e.preventDefault();
            console.log("MOUSE UP");
            $('.slider').width("0%");
            $('.slider').animate({'width': '100%'},3000, swipeRight);
        })
        .mousedown(function() {
            console.log("MOUSE DOWN");
            $('.slider').stop();
        });

    $('main')
        .mouseup(function(){
            console.log("MOUSE UP");
            $('.slider').animate({'width': '100%'},3000, swipeRight);
        })
        .mousedown(function() {
            console.log("MOUSE DOWN");
            $('.slider').stop();
        });

});

function timeLine() {
    $('.slider').animate({'width': '100%'},3000, swipeRight);    
}

function closePage() { 
    swipeDownAnimate();
    window.location.replace('/');
}

function swipeRight(){
    // console.log("Right SWIPED");
    
    currentTab = $('.active').html();
    
    if(currentTab < totalTabs) {
        $('.slider').stop(true);
        $('.slider').width('0%');
        timeLine();
        currentTab++;
        var temp = 'test-swipe-' + currentTab;
        $(document).ready(function(){
            $('.tabs').tabs('select',temp);
        });
    } else {
        closingAnimate();
        window.location.replace('/');
    }

}

function swipeLeft() {
    $('.slider').stop(true);
    $('.slider').width('0%');
    timeLine();
    currentTab = $('.active').html();
    if(currentTab > 0) currentTab--;
    var temp = 'test-swipe-' + currentTab;
    $(document).ready(function(){
        $('.tabs').tabs('select',temp);
    });
}

function closingAnimate() {
    $('#loading').removeClass('hide');
}

function swipeDownAnimate() {
    $('main').animate({width: '0%', height: '0%', bottom: '0', left: '50%'}, 'slow', closingAnimate);
}