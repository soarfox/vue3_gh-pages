<template>
  <div>
    <!-- {{ singleProduct }} -->

    <!-- 使用BootStrap的格線系統方式來排版, 如果當使用者點擊查看更多後, this.$route.params.id會有商品的id, 因此便將這個產品列表的div給隱藏起來, 只留下router-view的畫面 -->
    <div class="row container">
      <div class="col-6">
        <!-- 樣式設定參考官網: https://getbootstrap.com/docs/5.0/content/images/#picture -->
        <img :src="singleProduct.imageUrl" class="img-fluid rounded mx-auto d-block img-cover" :alt="singleProduct.title">
      </div>
      <div class="col-6">
        <div class="card" style="width: 34rem;">
          <div class="card-body">
            <h2 class="card-title">{{ singleProduct.title }}</h2>
            <hr>
            <h4 class="card-text">{{ singleProduct.description }}</h4>
            <div class="text-end">
              <h5 class="card-subtitle mb-2 text-decoration-line-through">NT${{ singleProduct.origin_price }}元</h5>
              <h3 class="card-subtitle mb-2 text-danger">NT${{ singleProduct.price }}元</h3>
              <!-- 下拉式選單可以套用Bootstrap 5的樣式 class="form-select" :https://getbootstrap.com/docs/5.0/forms/select/, 原本這裡使用v-model來雙向綁定數量的變化, 但因為這裡使用的是mapState取得數量資料, 而沒有寫入的動作, 因此如果隨意調整下拉式數量選單後, 小計和總金額的數字並不會跟著改變, 因此這裡改用value方式並使用change事件, 注意:而且需要透過箭頭函式才能在當change事件被觸發後, 使用箭頭函式取得事件的資訊(evt), 並且把該資訊當作參數傳入setCartQuantity function使用 -->
              <select name="" id="" class="form-select text-end" value="1">
                <!-- 記得要將value值也進行綁定(v-bind, 縮寫為:號), 使數量數值能夠正確被取得 -->
                <option :value="i" v-for="i in 20" :key="i">{{ i }}{{ singleProduct.unit }}</option>
              </select>
              <hr>
              <h6 class="card-subtitle mb-2">小計 NT${{ singleProduct.price }}元</h6>
              <a href="#" class="btn btn-danger">加入購物車</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 單一產品的資料
      singleProduct: {},
      // 顯示環境變數並設定變數內容
      // console.log(import.meta.env.VITE_API);
      api: import.meta.env.VITE_API,
      // console.log(import.meta.env.VITE_APIPATH);
      apiPath: import.meta.env.VITE_APIPATH,
    }
  },
  methods: {
    getSingleProduct(id) {
      // 顯示單一類別的產品
      this.$http.get(`${this.api}/api/${this.apiPath}/product/${id}`)
        .then((res) => {
          // console.log(res);
          this.singleProduct = res.data.product;
          console.log(this.singleProduct);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    console.log('this.$route.params.id=', this.$route.params.id);
    const productId = this.$route.params.id;
    this.getSingleProduct(productId);
  }
}
</script>

<style lang="scss">
// 引入的方式為@import
@import "../assets/all.scss";

// 設定圖片樣式
.img-cover {

  width: 600;

  /* 因為圖片設定寬度或高度後容易變形, 且使圖片能夠填滿所設定的寬與高的框框而比例盡可能不失真, 故建議可加上object-fit: cover; 參考官網:https://developer.mozilla.org/zh-TW/docs/Web/CSS/  */
  object-fit: cover;
}
</style>