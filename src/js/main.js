import { createApp } from 'vue';
import axios from 'axios';

const $ = (id) => {
  return document.getElementById(id);
}

const SLIDE_ITEMS = [
  {"img": "202503_lab-pv", "url": "https://youtu.be/f9qyBV11SAA"},
  // {"img": "202502_lab-intro", "url": "https://cocolabjp.tumblr.com/post/775807831215685632"},
  // {"img": "202501_newyear", "url": "/"},
  {"img": "202412_heroesleague", "url": "https://cocolabjp.tumblr.com/post/769358700648464384"},
  {"img": "202411_geekten2024", "url": "https://cocolabjp.tumblr.com/post/767764346840481792"},
  {"img": "202411_HAR-Book", "url": "https://cocolabjp.tumblr.com/post/766362900529020928"},
  {"img": "202409_ipsjKansai", "url": "https://cocolabjp.tumblr.com/post/763005611667570688"},
  {"img": "202409_100program", "url": "https://cocolabjp.tumblr.com/post/762935350489464832"},
  {"img": "202404_startup", "url": "https://note.com/cocolabjp/n/n705cb3d2b866"},
];

const app = createApp({
  delimiters: ['${', '}'],
  data() {
    return {
      pageType: 'page',
      logoWidth: 180,
      news: [],
      blog: [],
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
    scrollTo(target, offset) {
      window.scrollTo({
        top: $(target).offsetTop - offset,
        behavior: 'smooth'
      });
    },
    scrollToH3(target) {
      this.scrollTo(target, 70);
    },
    scrollToH4(target) {
      this.scrollTo(target, 125);
    },
    scrollToH5(target) {
      this.scrollTo(target, 180);
    },
    scrollToRef(target) {
      this.scrollTo(target, 180);
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
            this.blog = res.data.blog;
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
