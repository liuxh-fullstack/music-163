$(function(){
    $(".header-center-box>input").focus(function(){
        $(".header").addClass('active')
    })

    $(".header-cancel").click(function(){
        $(".header").removeClass("active")
    })
})