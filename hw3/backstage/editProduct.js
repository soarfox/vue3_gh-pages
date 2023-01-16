// 引用Vue esm且引用createApp方法進來, 但其實是把整包都抓下來後, 取出createApp, 其實檔案大小跟整包抓下來是一樣大的
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 宣告此些變數, 避免瀏覽器一開始就報錯
let productModal = null;
let delProductModal = null;

// 產品資料格式
createApp({
    //資料
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'cheetah116',
            // 判斷是否為"建立新的產品", 如果是true, 則顯示新增產品的model; 如果為false, 則顯示編輯的modal且代入該產品的各項內容到欄位內(已使用v-model綁定)
            isAddProduct: true,
            //建立一個空陣列資料, 用來接收從axios回傳回來的商品資料
            products: [],
            // 建立一個暫時性的產品物件, 用於新增產品內容使用, 其物件內的其他資料由欄位綁v-model進行資料新增, 就不需特別在此處先新增預設屬性
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    //方法(請記得尾字有"s")
    methods: {
        checkLogin() {
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((response) => {
                    // console.log("驗證登入成功");
                    // console.log(response.data);
                    this.getData();
                })
                .catch((error) => {
                    // console.dir(error);
                    alert(error);

                    //因驗證登入失敗, 故執行跳轉到登入畫面; 返回上一層資料夾請使用兩個.符號
                    //參考資料:https://kumo.tw/article.php?id=8
                    location.href = '../login.html';
                })
        },
        // 取得產品列表資料
        getData() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/all`)
                .then((response) => {
                    this.products = response.data.products;
                    // console.log(this.products);
                })
                .catch((error) => {
                    console.dir(error);
                    // alert(error.data);
                })
        },
        // 依據傳入的參數字串, 判斷要執行的對應行為
        openProductModal(operation, product) {
            if (operation === 'new') {
                // 將tempProduct的imagesUrl陣列(新增多張圖片的內容)清空
                this.tempProduct = {
                    imagesUrl: [],
                };
                // 將是否要新增產品此變數改成true, 以利稍後按下modal視窗的確認按鈕時, 可以判斷是要進行新增產品的動作
                this.isAddProduct = true;
                productModal.show();
            } else if (operation === 'edit') {
                // 取出該產品內容, 以利將資料顯示於model裡
                this.tempProduct = { ...product };
                // 將是否要新增產品此變數改成false, 以利稍後按下modal視窗的確認按鈕時, 可以判斷是要進行編輯產品的動作
                this.isAddProduct = false;
                productModal.show();
            } else if (operation === 'delete') {
                // 取出該產品內容, 這樣才能取得產品的id, 如此才能在後續執行刪除產品的行為
                this.tempProduct = { ...product };
                this.isAddProduct = false;
                delProductModal.show();
            }
        },
        // 當按下新增產品的確認按鈕
        checkedBtnOperation(isAddProduct, productId) {
            productModal.hide();
            // 若為true代表是要新增產品
            if (isAddProduct === true) {
                // 呼叫建立產品的API
                this.postProduct();
                // 若為false代表是要編輯產品
            } else if (isAddProduct === false) {
                // console.log(productId);
                // 呼叫編輯產品的API且帶入產品id
                this.editProduct(productId);
            }
        },
        // 建立一個產品資料
        postProduct() {
            // 此處請記得使用物件方式將產品資料帶入API內
            axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, { data: this.tempProduct })
                .then((response) => {
                    // console.log(response);
                    alert("建立產品成功!");
                    this.getData();
                })
                .catch((error) => {
                    // console.dir(error);
                    alert(error.data.message);
                })
        },
        // 編輯一筆產品資料
        editProduct(productId) {
            // 此處請記得使用物件方式將產品資料帶入API內
            axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${productId}`, { data: this.tempProduct })
                .then((response) => {
                    // console.log(response);
                    productModal.hide();
                    alert("編輯產品成功!");
                    this.getData();
                })
                .catch((error) => {
                    // console.dir(error);
                    productModal.hide();
                    alert(error.data.message);
                    this.getData();
                })
        },
        // 刪除一筆產品資料
        deleteProduct(productId) {
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${productId}`)
                .then((response) => {
                    // console.log(response);
                    delProductModal.hide();
                    alert("已刪除產品!");
                    this.getData();
                })
                .catch((error) => {
                    // console.dir(error);
                    delProductModal.hide();
                    alert(error.data.message);
                    this.getData();
                })
        },
        // 如果tempProduct.imagesUrl不是一個陣列(或者其不存在時), 則呼叫createImages方法創建一個空陣列, 且直接在tempProduct.imagesUrl內新增一個空字串'', 以利新增圖片
        createImagesUrlArray() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },
    //生命週期(在mounted此階段代表畫面上的DOM元素都已經生成完成了)
    mounted() {
        //在建立Bootstrap Modal元件的實體之前, 記得先在最外層宣告modal變數為null, 避免因為找不到該變數而報錯
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        //取得 Token（Token 僅需要設定一次, 參考資料同上
        const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        //參考自axios文件的此處:https://github.com/axios/axios#global-axios-defaults
        axios.defaults.headers.common['Authorization'] = myToken;

        //呼叫檢查登入函式, 驗證人員身份, 如果尚未登入則透過函式導回登入畫面
        this.checkLogin();
    }

}).mount('#app');