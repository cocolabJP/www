import { createApp } from 'vue';
import axios from 'axios';

const $ = (id) => {
  return document.getElementById(id);
}

const app = createApp({
  delimiters: ['${', '}'],
  data() {
    return {
      pageType: 'page',
      logoWidth: 180,
      news: [],
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
      this.loadTumblrNews();
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
      } else if(window.scrollY > 58) {
        $("header").classList.add("scaled");
        $("header").classList.remove("fixed");
        $("header").classList.remove("drawer-opened");
        $("logomark").style.width = Math.max(50, (this.logoWidth + 58 - window.scrollY)) + "px";
      } else {
        $("header").classList.remove("scaled");
        $("logomark").style.width = "";
      }
    },
    openDrawerMenu() {
      $("header").classList.toggle("drawer-opened");
    },
    scrollTo(target) {
      window.scrollTo({
        top: $(target).offsetTop - 85,
        behavior: 'smooth'
      });
    },
    async loadTumblrNews() {
      axios.get("https://cocolab.yukimat.jp/rss/", {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
        .then((res) => {
          if(res.status == 200) {
            this.news = res.data.news;
          }
        })
        .catch(err => {
          console.log("err:", err);
        });
    },
    getPrettyDate(dt) {
      return new Date(dt).toLocaleDateString('ja-JP', {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replaceAll("/", ".");
    }
  },
});
app.mount('#app');
