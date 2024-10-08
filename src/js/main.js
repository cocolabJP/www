import { createApp } from 'vue';
import axios from 'axios';

const $ = (id) => {
  return document.getElementById(id);
}

const SLIDE_ITEMS = [
  {"img": "202404_startup", "url": "https://note.com/cocolabjp/n/n705cb3d2b866"},
  {"img": "202409_ipsjKansai", "url": "https://cocolabjp.tumblr.com/post/763005611667570688"},
  {"img": "202409_100program", "url": "https://cocolabjp.tumblr.com/post/762935350489464832"}
];

const app = createApp({
  delimiters: ['${', '}'],
  data() {
    return {
      pageType: 'page',
      logoWidth: 180,
      news: [],
      slides: SLIDE_ITEMS,
      slideIndex: -1,
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
      this.setupSlideshow();
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
    setupSlideshow() {
      this.slideshowAnim();
      setInterval(() => {
        this.slideshowAnim();
      }, 5000);
    },
    slideshowAnim() {
      $("progress-bar").classList.remove("anim");
      setTimeout(() => { $("progress-bar").classList.add("anim"); }, 500);
      this.slideIndex++;
      if(this.slideIndex == this.slides.length) { this.slideIndex = 0; }
      $("slider-content").style.top = (-100 * this.slideIndex) + "%";
    },
    getSlideImgSrc(slide) {
      return "/static/img/top-visual/" + slide.img + ".png";
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
    scrollToRef(target) {
      window.scrollTo({
        top: $(target).offsetTop - 100,
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
