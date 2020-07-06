export default (Vue) => {
     //定义默认图片,在图片还未加载完成时显示
     let init = {
        default: '../assets/image/ajax-loader.gif'
    }
    // 还未加载的图片
    let futureList = [];
    //已经加载过的图片的缓存列表
    let cacheList = [];

    // 监听滚动条
    const listenScroll = () => {
        window.addEventListener('scroll', function () {
            let length = futureList.length
            for (let i = 0; i < length; i++) {
                scrollIn(futureList[i])
            }
        })
    }
    //检查是否已经加载过了的方法
    const isLoad = (imgSrc) => {
        //如果在缓存数组中存在,则已经加载过,返回true,否则false
        if (cacheList.indexOf(imgSrc) > -1) {
            return true
        } else {
            return false
        }
    }

    // 判断图片是否进入可视区,如果进入可视区,进行加载
    const scrollIn = (item) => {
        let el = item.el;
        let src = item.src;
        // 获取图片距离页面顶部的距离
        let top = el.getBoundingClientRect().top
        // 获取页面可视区的高度
        let winHeight = window.innerHeight;
        // top+5 此时已经进入了可视区5px
        if (top + 5 < winHeight) {
            let image = new Image()
            image.src = src
            image.onload = function () {
                el.src = src
                cacheList.push(src)
                futureList.remove(item)
            }
            return true
        } else {
            return false
        }
    }

    //定义一个remove方法.用于对储存图片的数组和记录已经加载过的图片的数组进行操作
    if (!Array.prototype.remove) {
        Array.prototype.remove = function (item) {
            // 如果此项不存在,即没有加载过,不进行操作直接返回
            if (!this.length) {
                return
            }
            let index = this.indexOf(item)
            // 如果已经加载过了,就截取掉
            if (index > -1) {
                this.splice(index, 1)
                return this
            }
        }
    }

    // 方法都定义完成,最后是主体
    const addListener = (el, binding) => {
        // 图片地址
        let imgSrc = binding.value
        // 如果已经加载过,直接给src赋值
        if (isLoad(imgSrc)) {
            el.src = imgSrc
            return false
        }
        let item = {
            el,
            src: imgSrc
        }
        // 将默认图片挂载到每一项
        el.src = init.default
        // 检查图片是否可以显示
        if (scrollIn(item)) {
            return
        }
        // 如果不能显示,将item放到futureList
        futureList.push(item)
        // 监听滚动事件
        listenScroll()
    }

    // 注册自定义指令
    Vue.directive('lazyload', {
        inserted: addListener,
        updated: addListener
    })
    // 之后只需要在main.js中import,并use即可使用
    // <img v-lazyload="./xx/xx.png">
}
