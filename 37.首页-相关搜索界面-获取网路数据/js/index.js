$(function () {
    $(".header-center-box>input").focus(function () {
        $(".header").addClass('active')
        $(".header-container").show()
        serachScroll.refresh()
    })

    $(".header-cancel").click(function () {
        $(".header").removeClass("active")
        $(".header-container").hide()
    })

    $(".header-switch>span").click(function () {
        console.log(this.offsetLeft)
        $(this).addClass('active').siblings().removeClass("active")
        $(".header-switch>i").animate({ left: this.offsetLeft }, 500)
    })

    // 搜索部分
    $(".search-ad>span").click(function () {
        $(".search-ad").remove()
    })

    let historyArray = getHistory()
    if (historyArray.length === 0) {
        $(".search-history").hide()
    } else {
        $(".search-history").show()

        historyArray.forEach(function (item) {
            let oLi = $("<li>" + item + "</li>")
            $(".history-bottom").append(oLi)
        })
    }

    $(".header-center-box>input").blur(function () {
        if (this.value.length === 0) {
            return
        }
        let historyArray = getHistory()
        historyArray.unshift(this.value)
        this.value = ""
        localStorage.setItem("history", JSON.stringify(historyArray))
    })

    $(".history-top>img").click(function () {
        localStorage.removeItem("history")
    })

    function getHistory() {
        let historyArray = localStorage.getItem("history")
        if (!historyArray) {
            historyArray = []
        } else {
            historyArray = JSON.parse(historyArray)
        }
        return historyArray
    }

    // 处理热搜榜
    HomeApis.getHomeHotDetail().then(function (data) {
        console.log('获取热搜榜数据：', data)
        let html = template('hotDetail', data)
        $(".hot-bottom").html(html)
        serachScroll.refresh()
    }).catch(function (error) {
        console.log(error)
    })

    // 创建滚动
    let serachScroll = new IScroll(".header-container", {
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

    // 处理相关搜索界面
    $(".header-center-box>input")[0].oninput = throttle(function () {
        console.log(this.value)
        if (this.value.length === 0) {// 说明用户没有输入数据
            $(".search-ad").show()
            $(".search-history").show()
            $(".search-hot").show()
            $(".search-current").hide()
        } else {
            $(".search-ad").hide()
            $(".search-history").hide()
            $(".search-hot").hide()
            $(".search-current").show()

            HomeApis.getHomeSearchsuggest().then(function (data) {
                console.log(data)
                $(".current-bottom>li").remove()
                data.result.allMatch.forEach(function (obj) {
                    let oLi = $(`
                        <li>
                            <img src="images/search/topbar-search.png" alt="">
                            <p>${obj.keyword}</p>
                        </li>
                    `)
                    $(".current-bottom").append(oLi)
                })
            }).catch(function (error) {
                console.log(error)
            })
        }

        $(".current-top").text(`搜索"${this.value}"`)
    }, 1000)


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

    // 官方首页是没有上拉加载的，所以不需要上拉加载的代码了，所以就把上拉加载的所有相关代码给移除(注释)掉
    // let bottomHeight = $(".pull-up").height()
    // // console.log("bottomHeight:", bottomHeight)

    // let maxOffSetY = myScroll.maxScrollY - bottomHeight // maxScrollY是属于myScroll的
    // let isPullUp = false

    /*
    由于IScroll中的数据都是从网络中加载的，所以一进来IScroll中没有数据，所以一进来最大的滚动的距离就是0 
     */
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
            // } else if (this.y <= this.maxScrollY - bottomHeight) { // 因为this.maxScrollY是一直在改变的，所以不能在这里判断
        }
        /* else if (this.y <= maxOffSetY) {
           // console.log("能够看到上拉加载更多啦")
           $(".pull-up>p>span").html("松手加载更多")
           this.maxScrollY = maxOffSetY
           isPullUp = true
       } */
        // console.log(this.y, this.maxScrollY)
    })

    myScroll.on("scrollEnd", function () {
        if (isPullDown && !isRefresh) {
            isRefresh = true
            // 去网络刷新数据
            refreshDown()
        }
        /*  else if (isPullUp && !isRefresh) {
             $(".pull-up>p>span").html("加载中。。。")
             isRefresh = true
             // 去网络刷新数据
             refreshDown()
         } */
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

    /*  function refreshUp() {
         setTimeout(function () {
             console.log("数据加载完毕")
             isPullUp = false
             isRefresh = false
             myScroll.maxScrollY = maxOffSetY + bottomHeight
             myScroll.scrollTo(0, myScroll.maxScrollY)
         }, 3000)
     } */

    /* 获取Banner的数据 */
    HomeApis.getHomeBanner().then(function (data) {
        // console.log("首页Banner的data：",data)
        let html = template("bannerSlide", data)
        $(".swiper-wrapper").html(html)
        // 获取完数据再创建轮播图，这样才能对轮播图的参数真正起作用
        new Swiper(".swiper-container", {
            autoplay: {
                delay: 1000,
                disableOnInteraction: false
            },
            loop: true,//循环滚动
            pagination: {// 分页器
                el: '.swiper-pagination',
                bulletClass: 'my-bullet',
                bulletActiveClass: 'my-bullet-active'
            },
            observer: true,
            observeParents: true,
            observeChildren: true
        })
        myScroll.refresh()//iscroll需要重新计算高度
    }).catch(function (error) {
        console.log(error)
    })


    /* 创建首页导航 */
    let date = new Date()
    // console.log(date.getDate())
    $(".nav i").html(new Date().getDate())


    HomeApis.getHomeRecommend().then(function (data) {
        data.title = "推荐歌单"
        data.subTitle = "歌单广场"
        data.result.forEach(function (obj) {
            obj.width = 216 / 100
            obj.playCount = formatNum(obj.playCount)
        })
        // console.log(data)
        let html = template('category', data)
        $(".recommend").html(html)
        $(".recommend .category-title").forEach(function (ele) {
            $clamp(ele, { clamp: 2 })
        })
        myScroll.refresh()
    }).catch(function (error) {
        console.log(error)
    })

    HomeApis.getHomeExclusive().then(function (data) {
        data.title = "独家放送"
        data.subTitle = "网易出品"
        data.result.forEach(function (obj, index) {
            obj.width = 334 / 100
            if (index === 2) {
                obj.width = 690 / 100
            }
        })
        console.log(data)
        let html = template('category', data)
        $(".exclusive").html(html)
        $(".exclusive .category-title").forEach(function (ele) {
            $clamp(ele, { clamp: 2 })
        })
        myScroll.refresh()
    }).catch(function (error) {
        console.log(error)
    })

    HomeApis.getHomeAlbum().then(function (data) {
        data.title = "新碟新歌"
        data.subTitle = "更多新碟"
        data.result = data["albums"]
        data.result.forEach(function (obj) {
            obj.artistName = obj.artist.name
            obj.width = 216 / 100
        })
        // console.log(data)
        let html = template('category', data)
        $(".album").html(html)
        $(".album .category-title").forEach(function (ele) {
            $clamp(ele, { clamp: 2 })
        })
        $(".album .category-singer").forEach(function (ele) {
            $clamp(ele, { clamp: 1 })
        })
        myScroll.refresh()
    }).catch(function (error) {
        console.log(error)
    })

    HomeApis.getHomeMV().then(function (data) {
        data.title = "推荐MV"
        data.subTitle = "更多MV"
        data.result.forEach(function (obj) {
            obj.width = 334 / 100
        })
        // console.log(data)
        let html = template('category', data)
        $(".mv").html(html)
        $(".mv .category-title").forEach(function (ele) {
            $clamp(ele, { clamp: 1 }) //会被后面的.categoy-title覆盖
        })
        $(".mv .category-singer").forEach(function (ele) {
            $clamp(ele, { clamp: 1 })
        })
        myScroll.refresh()
    }).catch(function (error) {
        console.log(error)
    })

    HomeApis.getHomeDJ().then(function (data) {
        data.title = "主播电台"
        data.subTitle = "更多主播"
        data.result.forEach(function (obj) {
            obj.width = 216 / 100
        })
        // console.log(data)
        let html = template('category', data)
        $(".dj").html(html)
        $(".dj .category-title").forEach(function (ele) {
            $clamp(ele, { clamp: 2 })
        })
        myScroll.refresh()
    }).catch(function (error) {
        console.log(error)
    })

    function formatNum(num) {
        let res = 0;
        if (num / 100000000 > 1) {
            let temp = num / 100000000 + "";
            if (temp.indexOf(".") === -1) {
                res = num / 100000000 + "亿";
            } else {
                res = (num / 100000000).toFixed(1) + "亿";
            }
        } else if (num / 10000 > 1) {
            let temp = num / 10000 + "";
            if (temp.indexOf(".") === -1) {
                res = num / 10000 + "万";
            } else {
                res = (num / 10000).toFixed(1) + "万";
            }
        } else {
            res = num;
        }
        return res
    }

    /* 
    等待所有图片都加载完成再刷新
    */
    setTimeout(function () {
        console.log(myScroll.maxScrollY)
        myScroll.refresh()
        console.log(myScroll.maxScrollY)
    }, 5000);
})