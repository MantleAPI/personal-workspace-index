<template>
  <div id="app">
    <img src="https://cdn.jsdelivr.net/gh/MobiusBeta/assets/images/BG_A_Default_1.jpg" alt="" :class="bg">
    <div class="cover"></div>
    <div class="time">{{hour}}:{{minute}}</div>
    <div id="nav">
      <Index v-if="true" :bg="bg" v-model="bg"/>
    </div>
  </div>
</template>

<script>
import Index from '@/components/Index.vue'
export default {
  data() {
    return {
      hour: '',
      minute: '',
      bg: {
        'bgPic': true,
        'bgFocus': false
      },
      showBar: true
    }
  },
  created() {
    // 初始化时间
    let currentSysTime = new Date();
    this.hour = currentSysTime.getHours();
    this.minute = (currentSysTime.getMinutes() + "").padStart(2, "0");
    // 刷新时间
    setInterval(()=>{
      currentSysTime = new Date();
      this.hour = currentSysTime.getHours();
      this.minute = (currentSysTime.getMinutes() + "").padStart(2, "0");
    }, 5000);
    // 单击时间背景变灰
    document.addEventListener('mousedown',(e) => {
      let clzName = e.target.className
      if(clzName.indexOf('search-btn') < 0 && clzName.indexOf('search-content') < 0  && clzName.indexOf('tips') < 0 && clzName.indexOf('goto') < 0) {
        this.bg.bgFocus = false;
      }
    });
  },
  methods: {
    
  },
  components: {
    Index
  }
}
</script>