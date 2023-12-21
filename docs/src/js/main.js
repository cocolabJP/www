import { createApp } from 'vue'

const $ = (id) => {
  return document.getElementById(id);
}

const app = createApp({
  delimiters: ['${', '}'],
  data() {
    return {
      pageType: 'page',
      logoWidth: 180
    };
  },
  created: function() {
    this.pageType = $('app').dataset.type;
    if(this.pageType == 'top') {
      window.addEventListener('scroll', this.onScroll);
      window.addEventListener('resize', this.onResizeWindow);
    }
  },
  mounted: function() {
    if(this.pageType == 'top') {
      this.onResizeWindow();
      this.onScroll();
    }
  },
  destroyed: function () {
    if(this.pageType == 'top') {
      window.removeEventListener('scroll', this.onScroll);
    }
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
        $("header").classList.add("fixed");
      } else if(window.scrollY > 60) {
        $("header").classList.add("scaled");
        $("header").classList.remove("fixed");
        $("header").classList.remove("drawer-opened");
        $("logomark").style.width = Math.max(50, (this.logoWidth + 60 - window.scrollY)) + "px";
      } else {
        $("header").classList.remove("scaled");
        $("logomark").style.width = "";
      }
    },
    openDrawerMenu() {
      $("header").classList.toggle("drawer-opened");
    }
  },
});
app.mount('#app');
