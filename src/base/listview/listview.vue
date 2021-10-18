<template>
  <scroll :data="data"
    class="listview"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li v-for="(group, index) in data" class="list-group"
      :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items" class="list-group-item" :key="index">
            <img v-lazy="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortTouchStart"
      @touchmove.stop.prevent="onShortTouchMove">
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item.key"
          :data-index="index"
          class="item"
          :class="{'current': currentIndex === index}"
        >
          {{item.title}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div v-if="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll.vue'
  import Loading from 'base/loading/loading.vue'
  import { getData } from 'common/js/dom.js'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    name: 'ListView',
    components: {
      Scroll,
      Loading
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        probeType: 3,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
    },
    computed: {
      shortcutList() {
        return this.data.map((group, index) => {
          return {
            title: group.title.substr(0, 1),
            key: index
          }
        })
      },
      fixedTitle() {
        if(this.scrollY >= 0) return ''
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortTouchStart(e) {
        const index = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = index
        this._scrollTo(index)
      },
      onShortTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let data = Math.floor((this.touch.y2 - this.touch.y1) / 18)
        let anchorIndex = parseInt(this.touch.anchorIndex) + data
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        if(!index && index !== 0) return;
        if(index < 0) index = 0
        if(index > this.listHeight.length - 2) index = this.listHeight.length - 2
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        let list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        if(newY > 0) {
          this.currentIndex = 0
          return
        }
        for(let i = 0; i < listHeight.length - 1; i ++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if(-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return 
          }
        }
        this.currentIndex = listHeight.length - 2
      },
      diff (newVal) {
        let fixedTop = (newVal && newVal < TITLE_HEIGHT) ? TITLE_HEIGHT - newVal : 0
        if(this.fixedTop === fixedTop) return;
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${-fixedTop}px,0)`
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position:absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>