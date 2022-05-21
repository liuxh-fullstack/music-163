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


    // 底部相关
    let pageArray = ["home", "video", "me", "friend", "account"]

    $(".footer>ul>li").click(function() {
        $(this).addClass('active').siblings().removeClass("active")
        let url = $(this).find("img").attr("src")
        let newUrl = url.replace("normal", "selected")
        $(this).find("img").attr("src", newUrl)
        $(this).siblings().find("img").forEach(function(oImg) {
            oImg.src = oImg.src.replace("selected", "normal")
        })

        // 获取点击的底部按钮在父元素中的索引
        let currentName = pageArray[$(this).index()]
        $(".header").removeClass().addClass("header " + currentName)
    })
})