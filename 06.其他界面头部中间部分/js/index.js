$(function() {
    $(".header-center-box>input").focus(function() {
        $(".header").addClass('active')
    })

    $(".header-cancel").click(function() {
        $(".header").removeClass("active")
    })

    $(".header-switch>span").click(function() {
        console.log(this.offsetLeft)
        $(this).addClass('active').siblings().removeClass("active")
        $(".header-switch>i").animate({ left: this.offsetLeft }, 500)
    })
})