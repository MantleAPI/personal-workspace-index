<template>
    <div class="search-bar-group">
        <div class="search-bar">
            <input class="search-content" type="text" placeholder="探索" @click="flag=true" @focus="bgFocus" @keyup.enter="search" v-model="searchText"/>
        </div>
        <transition
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave">
            <div ref="group" class="search-btn-group" v-if="flag">
                <span :class="opts[0]" @click="btnClick(0, $event)"><i class="iconfont search-btn btn-baidu">&#xe66b;</i></span>
                <span :class="opts[1]" @click="btnClick(1, $event)"><i class="iconfont search-btn btn-google">&#xe671;</i></span>
                <span :class="opts[2]" @click="btnClick(2, $event)"><i class="iconfont search-btn btn-github">&#xe632;</i></span>
                <span :class="opts[3]" @click="btnClick(3, $event)"><i class="iconfont search-btn btn-bili">&#xe64f;</i></span>
                <span :class="opts[4]" @click="btnClick(4, $event)"><i class="iconfont search-btn btn-key">&#xe614;</i></span>
            </div>
        </transition>
        <div class="tips" v-if="showTips">译文：「&nbsp;<span v-html="translateText"></span>&nbsp;」</div>
    </div>
</template>

<script>
export default {
    props: ['bg'],
    data(){
        return {
            searchText: '',
            translateText: '',
            flag: false,
            showTips: false,
            opts: [
                {'opt': true,
                 'selected': true},
                {'opt': true,
                 'selected': false},
                {'opt': true,
                 'selected': false},
                {'opt': true,
                 'selected': false},
                {'opt': true,
                 'selected': false},
            ],
            currentSelected: 0,
            timer: ''
        }
    },
    created(){
        document.addEventListener('mousedown',(e) => {
            let clzName = e.target.className
            console.log(clzName);
            if(clzName.indexOf('search-btn') < 0 && clzName.indexOf('search-content') < 0 && clzName.indexOf('tips') < 0 && clzName.indexOf('goto') < 0) {
                this.flag = false;
                this.bg.bgFocus = false;
                this.showTips = false;
            }else if(clzName.indexOf('search-btn') >= 0) {
                e.preventDefault();
            }else if(clzName.indexOf('search-btn') >= 0 || clzName.indexOf('search-content') >= 0) {
                this.showTips = true;
            }
        });
        // document.onmousedown = (e) => {
        //     let clzName = e.target.className
        //     if(clzName.indexOf('search-btn') < 0 && clzName.indexOf('search-content') < 0) {
        //         this.flag = false;
        //         this.bg.bgFocus = false;
        //     }else if(clzName.indexOf('search-btn') >= 0) {
        //         e.preventDefault();
        //     }
        // }
    },
    methods: {
        beforeEnter(el) {
            el.style.transform = 'translateY(-42px)';
            el.style.opacity = '0';
        },
        enter(el) {
            el.offsetWidth
            el.style.transform = 'translateY(0px)';
            el.style.opacity = '0.8';
            el.style.transition = 'all .4s ease';
        },
        leave(el) {
            el.offsetWidth
            el.style.transform = 'translateY(-42px)';
            el.style.opacity = '0';
            el.style.transition = 'all .4s ease';
        },
        btnClick(index, e) {
            let _opts = this.opts
            for(var i in _opts) {
                _opts[i].selected = false;
            }
            _opts[index].selected = true;
            this.currentSelected = index;
        },
        bgFocus() {
            this.bg.bgFocus = true;
        },
        search() {
            let prefix = '';
            switch(this.currentSelected) {
                case 0:
                    prefix = 'https://www.baidu.com/s?wd=';
                    break;
                case 1:
                    prefix = 'https://www.google.com/search?q='
                    break;
                case 2:
                    prefix = 'https://github.com/search?q=';
                    break;
                case 3:
                    if(this.searchText.toLowerCase().startsWith("bv")) {
                        prefix = 'https://www.bilibili.com/video/'
                    }else {
                        prefix = 'https://search.bilibili.com/all?keyword=';
                    }
                    break;
            }
            if(this.currentSelected <= 3) {
                window.open(prefix + this.searchText);
            }
        },
    },
    watch: {
        'searchText': function(newVal, oldVal) {
            clearTimeout(this.timer);
            if(newVal == '') return;
            if(this.currentSelected < 3 || (this.currentSelected == 3 && !newVal.toLowerCase().startsWith("bv"))) {
                this.timer = setTimeout(()=>{
                    this.$axios.get('/youdaoApi/translate?&doctype=json&type=AUTO&i=' + newVal).then(
                        (res) => {
                            let body = res.data;
                            this.translateText = body.translateResult[0][0].tgt
                        }
                    )
                }, 1000);
            }else if(this.currentSelected == 3) {
                if(!newVal.toLowerCase().startsWith("bv")) return;
                this.timer = setTimeout(()=>{
                    this.$axios.get('/biliApi/view?bvid=' + newVal).then(
                        (res) => {
                            let body = res.data;
                            if(body.code == 0) {
                                let picUrl = body.data.pic;
                                this.translateText = '<a class="goto" href="'+picUrl+'" target="_blank">'+picUrl+'</a>'
                            }
                        }
                    )
                }, 1000);
            }
        }
    }
}
</script>