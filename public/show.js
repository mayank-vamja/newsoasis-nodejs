$(document).ready(function(){
    $('nav').hide();
    $('.tabs').tabs({
        swipeable : true,
        responsiveThreshold : 2920,
        duration: 100,
        onShow: function(){$(".tabs-content").css('height','100%');}
    });
    $('#next-page').css('left', '23px');
    $('#top-menu').css('left', '13px');
    $('#top-menu').css('top', '0px');
    //$('#next-page').css('bottom', '23px');
    //$('#next-page').floatingActionButton();
    //$(".tabs-content").css('height','100%');
    
});


function swipeLeft(){
    currentTab = $('.active').html();
    if(currentTab < totalTabs) currentTab++;
    var temp = 'test-swipe-' + currentTab;
    $(document).ready(function(){
        $('.tabs').tabs('select',temp);
    });
}

function swipeRight() {
    currentTab = $('.active').html();
    if(currentTab > 0) currentTab--;
    var temp = 'test-swipe-' + currentTab;
    $(document).ready(function(){
        $('.tabs').tabs('select',temp);
    });
}
