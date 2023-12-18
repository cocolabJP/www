import { createApp } from 'vue'

const $ = (id) => {
  return document.getElementById(id);
}

const app = createApp({
  delimiters: ['${', '}'],
  data() {
    return {
      logoWidth: 180
    };
  },
  created: function() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResizeWindow);
  },
  mounted: function() {
    this.onResizeWindow();
    this.onScroll();
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onResizeWindow() {
      let w = window.innerWidth;
      this.logoWidth = w > 1280 ? 180
                     : w < 640 ? 90
                     : w * 180 / 1280;
    },
    onScroll() {
      if(window.scrollY > this.logoWidth * 2) {
        $("header-top").classList.add("fixed");
      } else if(window.scrollY > 60) {
        $("header-top").classList.add("scaled");
        $("header-top").classList.remove("fixed");
        $("logomark").style.width = Math.max(50, (this.logoWidth + 60 - window.scrollY)) + "px";
      } else {
        $("header-top").classList.remove("scaled");
        $("logomark").style.width = "";
      }
    }
  },
});
app.mount('#app');
