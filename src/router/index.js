import Vue from 'vue'
import VueRouter from 'vue-router'

const Rank = () => import('components/rank/rank.vue')
const Recommend = () => import('components/recommend/recommend.vue')
const Search = () => import('components/search/search.vue')
const Singer = () => import('components/singer/singer.vue')



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: './recommend'
  },
  {
    path: "/recommend",
    component: Recommend
  },
  {
    path: '/rank',
    component: Rank
  },
  {
    path: '/singer',
    component: Singer
  },
  {
    path: '/search',
    component: Search
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
