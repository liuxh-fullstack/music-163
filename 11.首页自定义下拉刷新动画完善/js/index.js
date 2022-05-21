$(function () {
    $(".header-center-box>input").focus(function () {
        $(".header").addClass('active')
    })

    $(".header-cancel").click(function () {
        $(".header").removeClass("active")
    })

    $(".header-switch>span").click(function () {
        console.log(this.offsetLeft)
        $(this).addClass('active').siblings().removeClass("active")
        $(".header-switch>i").animate({ left: this.offsetLeft }, 500)
    })


    // 底部相关
    let pageArray = ["home", "video", "me", "friend", "account"]

    $(".footer>ul>li").click(function () {
        $(this).addClass('active').siblings().removeClass("active")
        let url = $(this).find("img").attr("src")
        let newUrl = url.replace("normal", "selected")
        $(this).find("img").attr("src", newUrl)
        $(this).siblings().find("img").forEach(function (oImg) {
            oImg.src = oImg.src.replace("selected", "normal")
        })

        // 获取点击的底部按钮在父元素中的索引
        let currentName = pageArray[$(this).index()]
        $(".header").removeClass().addClass("header " + currentName)
    })


    /*处理下拉刷新公共的内容区域 */
    // 获取svg路径的长度
    let length = $("#refreshLogo")[0].getTotalLength()
    // 设置如下两个属性的值为svg路径的长度，那么svg就会被隐藏了
    $("#refreshLogo").css({ "stroke-dasharray": length })
    $("#refreshLogo").css({ "stroke-dashoffset": length })
    // 创建IScroll
    let myScroll = new IScroll(".main", {
        mouseWheel: false, // 不需要支持鼠标滚轮
        scrollbars: false, // 不需要支持滚动条
        /**
         * 需要使用iscroll-probe.js才能生效probeType
         * 1、滚动不繁忙的时候触发
         * 2、滚动时每隔一定时间触发
         * 3、每滚动一像素触发一次
         */
        probeType: 3
    })
    // 监听滚动
    let logoHeight = $(".pull-down").height()

    let isPullDown = false
    let isRefresh = false
    // 需要配置probeType属性才能响应scroll事件
    myScroll.on("scroll", function () {
        // console.log("滚动过程中", this.y)
        if (this.y >= logoHeight) {
            if (((this.y - logoHeight) * 3) <= length) {
                console.log("开始执行svg动画")
                $("#refreshLogo").css({ "stroke-dashoffset": length - (this.y - logoHeight) * 3 })
            } else {
                // console.log(this.y) // 绘制完成时候的y 180
                // console.log("已经画完了")
                this.minScrollY = 180
                isPullDown = true
            }
        }
    })

    myScroll.on("scrollEnd", function () {
        if (isPullDown && !isRefresh) {
            isRefresh = true
            // 去网络刷新数据
            refreshDown()
        }
    })

    function refreshDown() {
        setTimeout(function () {
            console.log("数据刷新完毕")
            isPullDown = false
            isRefresh = false
            myScroll.minScrollY = 0
            myScroll.scrollTo(0, 0)
            $("#refreshLogo").css({ "stroke-dashoffset": length })
        }, 3000)
    }
})