import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // 讓使用者能夠知道當前處在哪一個頁面, 此處的值可以任意命名, 不過在此使用'active', 因為想要套用BootStrap5的一個active樣式, 參考資料: https://router.vuejs.org/zh/api/#routeroptions
  // 可以在網址列輸入: http://localhost:8080/#/newpage, 並且隨意點擊左側連結, 可以看到樣式有被套用上去(呈現藍色底色), 如果是點擊上方navbar的超連結, 則被點擊的那一個的文字顏色也會比其他兩者更深一點點(需要仔細看)
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      // component: HomeView
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'aboutUs',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/products',
      name: 'productsPage',
      component: () => import('../views/ProductsView.vue'),
      children: [
        {
          // 在/號後方可加上一個自訂義名稱, 藉此實作出動態路由
          path: 'singleProduct/:id',
          component: () => import('../views/SingleProductView.vue'),
        },
      ]
    },
    {
      path: '/cart',
      name: 'cartPage',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/service',
      name: 'servicePage',
      component: () => import('../views/ServiceView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // console.log('to, from, savedPosition', to, from, savedPosition);
    // 如果使用者跳到特定頁面(/...)時, 想要觸發滾動的行為, 則可以這樣寫, 否則, 預設是不做滾動行為
    if (to.fullPath.match('products')) {
      return {
        // 即可滾動到最上方(距離top為0)
        top: 0,
      };
    }
    return {};
  },
})

// 在此將router進行匯出, 因此可以在main.js檔案來使用這個router設定
export default router;
