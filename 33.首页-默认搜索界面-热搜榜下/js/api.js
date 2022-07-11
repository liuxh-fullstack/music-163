; (function () {
    // 服务器地址
    axios.defaults.baseURL = 'http://localhost:3000'
    // 超时时间
    axios.defaults.timeout = 3000

    class NJHttp {
        static get(url = "", data = {}) {
            return new Promise(function (resolve, reject) {
                axios.get(url, {
                    params: data
                }).then(function (response) {
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }

        static post(url = "", data = {}) {
            return new Promise(function (resolve, reject) {
                axios.post(url, {
                    params: data
                }).then(function (response) {
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }

    class HomeApis {
        static getHomeBanner() {
            return NJHttp.get("/banner", { type: 2 })
        }

        static getHomeRecommend() {
            return NJHttp.get("/personalized")
        }

        static getHomeExclusive() {
            return NJHttp.get('/personalized/privatecontent')
        }
        static getHomeAlbum() {
            return NJHttp.get('/top/album', {
                offset: 0,
                limit: 6
            })
        }
        static getHomeMV() {
            return NJHttp.get('/personalized/mv')
        }
        static getHomeDJ() {
            return NJHttp.get('/personalized/djprogram')
        }
        // 热搜榜
        static getHomeHotDetail() {
            return NJHttp.get("/search/hot/detail")
        }
    }

    window.NJHttp = NJHttp
    window.HomeApis = HomeApis
})()

