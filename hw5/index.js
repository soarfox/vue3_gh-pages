// 匯入產品內容的Modal元件的.js檔
import product_modal from "./components/product_modal.js";

// 使用VeeValidate套件的步驟三: 在Vue.createApp({...});的前面, 在此"完整載入VeeValidate所有的驗證規則"; 因20223/03/01實測後發現載入所有的驗證規則, 將會導致輸入欄位會出現錯誤, 故在此採用下方的"載入特定幾個規則", 即可正常運行
// Object.keys(VeeValidateRules).forEach(rule => {
//   VeeValidate.defineRule(rule, VeeValidateRules[rule]);
// });

// 使用VeeValidate套件的步驟三: 可參考VeeValidate官方文件資料: https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules 或 可參考卡斯伯老師的VeeValidate表單驗證套件的使用說明: https://hackmd.io/FFv0a5cBToOATP7uI5COMQ , 僅載入特定幾個會使用的規則亦可
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
VeeValidate.defineRule('min', VeeValidateRules['min']);
VeeValidate.defineRule('max', VeeValidateRules['max']);
VeeValidate.defineRule('numeric', VeeValidateRules['numeric']);

// 使用VeeValidate套件的步驟四: 讀取外部的資源
// 將外部的中文字檔讀取進來, 此.json檔案已經手動複製並放在同一層資料夾內了, json檔內容來源為: https://github.com/logaretm/vee-validate/blob/vee-validate%404.1.16/packages/i18n/src/locale/zh_TW.json
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// 將設定檔案載入進來, 此處載入2個設定內容
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'), // 將驗證訊息改成中文
  validateOnInput: true, // 原本預設是當使用者輸入完成, 游標離開文字欄位時才會觸發驗證行為, 也就是change事件, 但現在將其設定調整為：使用者在輸入文字的當下，就立即進行驗證
});

// 宣告此些變數, 避免瀏覽器一開始就報錯, 且當生命週期走到mounted階段時, 代表畫面都已經生成完畢, 這時候再來抓取網頁裡的DOM元素時, 才能正確抓取得到, 故在生命週期mounted內定義該些變數的內容(詳細說明請見:2023 Vue直播班的影片名稱:"第三週額外補充，Bootstrap JS 部分"的14分01秒處往後看)
let productModalWindow = '';

const { createApp } = Vue;

// 使用createApp方法來建立Vue的環境且會在其中加入相關元件
const app = createApp({
  data() {
    return {
      testTesting:'test 123456789',
      // 建立VueLoading的變數: isLoading, loadingColor和loadingBackgroundColor
      isLoading: true,
      loadingColor: '#FFC78E',
      loadingBackgroundColor: '#FFFAF4',
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'cheetah116',
      // 空陣列資料, 用來接收從axios回傳回來的商品資料
      products: [],
      // 分頁的空物件
      pageObj: {},
      // 用來盛裝資料的物件, 藉此顯示於Modal內
      singleProduct: {},
      // 購物車內單一項產品資訊(用於將產品加入購物車及更新購物車資訊)
      singleCartData: {},
      // 購物車清單
      cartList: [],
      // 購物車內各品項內容
      cartProducts:[],
      // 表單資訊都在formOrder內
      formOrder:{
        user: {
          email: '',
          name: '',
          tel: '',
          address: '',
        },
        // 表單資訊的留言內容
        message: '',
      },
      // 針對fontAwesome旋轉小圖示的設定, 官方網站: https://fontawesome.com/
      loadingStatus: {
        loadingItem: '',
      }
    }
  },
  methods:{
    // 取得產品列表資料, 依資料數目來決定頁數有幾頁, 且如果要決定當前要跳到第幾頁, API本身即可使用?page=後方加上一個數字來跳到該頁的畫面, 故在此將其加上一個變數, 來決定要跳到第幾頁(如果資料有11筆以上, 則第11~20筆資料會顯示於第二頁裡), 而如果直接寫getProducts(pageObj), 則pageObj預設會是undefined, 故需要使用"參數預設值"的方式(pageObj = 1), 也就是如果沒有提供pageObj參數的內容, 則將其預設值設定為1, 這是ES6的寫法
    getProducts(pageObj = 1) {
          axios.get(`${this.apiUrl}/api/${this.apiPath}/products/?page=${pageObj}`)
          .then((response) => {
              // 當產品讀取完成, 關閉VueLoading效果
              this.isLoading = false;
              // console.log("產品讀取完成, 關閉VueLoading效果");

              this.products = response.data.products;
              // console.log(response.data);

              // 將分頁的資訊儲存起來
              this.pageObj = response.data.pagination;
              // console.log(`分頁資訊`, this.pageObj);

              // //進行資料排序(依照產品分類排序)
              // this.sortData();
          })
          .catch((error) => {
              // console.dir(error);
              alert(error.data);
          })
      },
      // 顯示產品更多資訊
      getProductDetail(productId){
        // 將fontAwesome旋轉小圖示設定產品id給它, 如果它有接收到這個id時就停止圖示轉動
        this.loadingStatus.loadingItem = productId;
        axios.get(`${this.apiUrl}/api/${this.apiPath}/product/${productId}`)
          .then((response) => {
            // 當axios API執行成功後, 將fontAwesome旋轉小圖示的內容清空, 使其恢復轉動
            this.loadingStatus.loadingItem = '';
            this.singleProduct = response.data.product;
            productModalWindow.show();
          })
          .catch((error) => {
              // console.dir(error);
              alert(error.data);
          })
      },
      // 將商品加入購物車; 對於內部元件Modal來說, 此addToCart方法是在外部接收資料的方法(且已準備好要接收的2個參數productId, qty=1)
      addToCart(productId, qty=1){
        // 將fontAwesome旋轉小圖示設定產品id給它, 如果它有接收到這個id時就停止圖示轉動
        this.loadingStatus.loadingItem = productId;

        // 欲加入購物車的資料需要有產品ID與數量
        this.singleCartData.product_id = productId;
        this.singleCartData.qty = qty;

        // 把當次要加入購物車的資料, 賦予給此API限定變數名稱的變數(data), 且data要用{}括住才符合此API要求
        axios.post(`${this.apiUrl}/api/${this.apiPath}/cart`, {data: this.singleCartData})
          .then((response) => {
            // 當axios API執行成功後, 將fontAwesome旋轉小圖示的內容清空, 使其恢復轉動
            this.loadingStatus.loadingItem = '';
            // console.log(response.data.data);
            alert(`已加入購物車`);
            // 取得購物車資訊
            this.getCartList();
          })
          .catch((error) => {
            // console.dir(error);
            alert(error.data.message);
          })
      },
      // 取得購物車列表
      getCartList(){
        axios.get(`${this.apiUrl}/api/${this.apiPath}/cart`)
          .then((response) => {
            // console.log(response.data.data);
            // 取得的資料內有包含總金額, 且該API本身就會自動為相同品項增添數量進去, 不需手動增加購物車內的產品數量
            this.cartList = response.data.data;
            // console.log(`this.cartList如下`);
            // console.log(this.cartList);

            this.cartProducts = this.cartList.carts;
            // console.log(this.cartProducts);
          })
          .catch((error) => {
            console.dir(error);
            // alert(error.data);
          })
      },
      // 移除購物車內單一品項
      removeCartItem(cartItemId){
        // 將fontAwesome旋轉小圖示設定產品id給它, 如果它有接收到這個id時就停止圖示轉動
        this.loadingStatus.loadingItem = cartItemId;

        axios.delete(`${this.apiUrl}/api/${this.apiPath}/cart/${cartItemId}`)
          .then((response) => {
            // 當axios API執行成功後, 將fontAwesome旋轉小圖示的內容清空, 使其恢復轉動
            this.loadingStatus.loadingItem = '';

            // console.log(response);
            alert(`已刪除該產品`);
            // 取得購物車資訊
            this.getCartList();
          })
          .catch((error) => {
            // console.dir(error);
            alert(error.data.message);
          })
      },
      // 清空購物車的內容
      deleteAllCartItem(){
        axios.delete(`${this.apiUrl}/api/${this.apiPath}/carts`)
          .then((response) => {
            // console.log(response);
            alert(`已清空購物車`);
            // 取得購物車資訊
            this.getCartList();
          })
          .catch((error) => {
            // console.dir(error);
            alert(error.data.message);
          })
      },
      // 調整購物車內單一商品的數量
      updateCart(item){
        // 將fontAwesome旋轉小圖示設定產品id給它, 如果它有接收到這個id時就停止圖示轉動
        this.loadingStatus.loadingItem = item.id;

        // 欲更新購物車的資料需要有產品ID與數量
        this.singleCartData.product_id = item.product_id;
        this.singleCartData.qty = item.qty;

        axios.put(`${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`, {data: this.singleCartData})
        .then((response) => {
          // 當axios API執行成功後, 將fontAwesome旋轉小圖示的內容清空, 使其恢復轉動
          this.loadingStatus.loadingItem = '';

          // console.log(response);
          alert(`已更新購物車`);
          // 取得購物車資訊
          this.getCartList();
        })
        .catch((error) => {
          // 當axios API執行失敗後, 將fontAwesome旋轉小圖示的內容清空, 使其恢復轉動
          this.loadingStatus.loadingItem = '';

          // console.dir(error);
          alert(error.data.message);
        })
      },
      // 創建一筆訂單資料
      createOrder(){
        if(this.cartProducts.length === 0){
          alert(`購物車內無品項, 無法送出訂單`);
          return;
        }else{
          // console.log(`購物車有品項, 歡迎下訂`);
          // 此API在成功送出訂單後會自動清除購物車的內容, 因此只需要將購物車清單重新取得一次, 即可讓畫面上呈現的購物車內容為空
          axios.post(`${this.apiUrl}/api/${this.apiPath}/order`, {data: this.formOrder})
          .then((response) => {
            // console.log(response);
            alert(`已送出訂單`);

            // 取得購物車資訊
            this.getCartList();

            // 在HTML內有使用ref="formContent", 故在此可使用$refs取得DOM元素並搭配VeeValidate內建的resetForm方法清除使用者所填的內容(但僅限清除form內有v-field元件的各欄位), 可參考VeeValidate官方網站: https://vee-validate.logaretm.com/v4/guide/components/handling-forms , 但留言區則因為不是v-field元件, 故需要自己清空內容
            this.$refs.formContent.resetForm();
            this.formOrder.message = '';
          })
          .catch((error) => {
            // console.dir(error);
            alert(error.data.message);
          })

          
        }
        
      },
      // 自行定義的VeeValidate套件的驗證方法
      isPhoneNumber(value) {
        // 必須為09開頭, 且後方只能輸入8碼數字
        const phoneNumber = /^(09)[0-9]{8}$/
        return phoneNumber.test(value) ? true : '手機號碼 需要填寫正確的手機號碼'
      },
  },
  // 將元件在此進行註冊(元件採用首字大寫的方式命名, 這跟Vite的規則是一樣的)
  components:{
    product_modal,
  },
  mounted(){
    this.getProducts();
    //在建立Bootstrap Modal元件的實體之前, 記得先在最外層宣告modal變數為'', 避免因為找不到該變數而報錯, 而當生命週期走到mounted時代表畫面都已經生成完畢, 此時進行抓取網頁DOM元素時才不會出錯, 故在此階段才將Modal實體化
    productModalWindow = new bootstrap.Modal(document.getElementById('productModal'));

    this.getCartList();
  }
}); // 原本.mount('#app')接在)號之後, 但這裡要先做分離, 且下方要加入Pinia方法及進行Vue環境與Pinia的綁定

// const pinia = createPinia();

// // 在Vue的環境之中使用Pinia的方法, 這樣子Vue的環境才能跟Piania進行綁定
// app.use(pinia);

// 使用VeeValidate套件的步驟二: 在Vue.createApp({...});的後方, 註冊全域的表單驗證元件(VForm, VField, ErrorMessage)
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
// 進行VueLoading套件的元件註冊
app.component("VLoading", VueLoading.Component);
app.mount('#app'); 