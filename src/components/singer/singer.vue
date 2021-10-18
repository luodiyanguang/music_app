<template>
  <div class="singer" ref="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
  
  import ListView from "base/listview/listview.vue"
  import Singer from 'common/js/singer'

  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import { mapMutations } from 'vuex'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'


  export default {
    name: "Singer",
    components: {
      ListView
    },
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
      // setTimeout(() => {
      //   this.singers = this._normalizeSinger(this.singers)
      // },1000)
    },
    methods: {
      ...mapMutations({
        singers: 'SET_SIGNER'
      }),
      _getSingerList() {
        getSingerList().then((res) => {
          if(res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
            // console.log(this.singers)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item , index) => {
          if(index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if(!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        });
        //转换为有序列表
        let ret = []
        let hot = []
        for(let key in map) {
          let val = map[key]
            if (val.title.match(/[a-zA-Z]/)) {
              ret.push(val)
            } else if (val.title === HOT_NAME) {
              hot.push(val)
            }
          }
          ret.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })
          return hot.concat(ret)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>