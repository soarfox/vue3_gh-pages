// 引用Vue esm且引用createApp方法進來, 但其實是把整包都抓下來後, 取出createApp, 其實檔案大小跟整包抓下來是一樣大的
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 匯入分頁元件(pagination)的.js檔
import pagination from './components/pagination.js';

// 匯入產品內容的Modal元件的.js檔
import product_modal from './components/product_modal.js';

// 匯入刪除產品的確認視窗Modal元件的.js檔
import delete_product_modal from './components/delete_product_modal.js';

// 宣告此些變數, 避免瀏覽器一開始就報錯, 且當生命週期走到mounted階段時, 代表畫面都已經生成完畢, 這時候再來抓取網頁裡的DOM元素時, 才能正確抓取得到, 故在生命週期mounted內定義該些變數的內容(詳細說明請見:2023 Vue直播班的影片名稱:"第三週額外補充，Bootstrap JS 部分"的14分01秒處往後看)
let productModal = '';
let delProductModal = '';

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
            // 新增一個自訂的欄位(商品評價星級productRatingStars)
            tempProduct: {
                imagesUrl: [],
                productRatingStars: ''
            },
            //建立一個空陣列資料, 處理排序後的產品內容
            arrProducts: [],

            // 建立一個分頁的空物件
            pageObj:{},

            // 建立一個抓取檔案上傳DOM元素的變數
            fileUpload: null,

            // 建立一個承接上傳檔案資訊的變數
            singleFileInfo: null,

            // 建立一個承接上傳檔案表單實體
            formData: new FormData(),

            // 建立一個上傳圖片後, 承接圖片網址的變數
            mainPicUrl: '',
        }
    },
    //方法(請記得methods的尾字有"s")
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
                    alert(error.data.message);

                    //因驗證登入失敗, 故執行跳轉到登入畫面; 返回上一層資料夾請使用兩個.符號
                    //參考資料:https://kumo.tw/article.php?id=8
                    location.href = '../login.html';
                })
        },
        // 取得產品列表資料, 依資料數目來決定頁數有幾頁, 且如果要決定當前要跳到第幾頁, API本身即可使用?page=後方加上一個數字來跳到該頁的畫面, 故在此將其加上一個變數, 來決定要跳到第幾頁(如果資料有11筆以上, 則第11~20筆資料會顯示於第二頁裡), 而如果直接寫getData(pageObj), 則pageObj預設會是undefined, 故需要使用"參數預設值"的方式(pageObj = 1), 也就是如果沒有提供pageObj參數的內容, 則將其預設值設定為1, 這是ES6的寫法
        getData(pageObj = 1) {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${pageObj}`)
                .then((response) => {
                    this.products = response.data.products;
                    // console.log(response.data);

                    // 將分頁的資訊儲存起來
                    this.pageObj = response.data.pagination;
                    // console.log(this.pageObj);

                    //進行資料排序(依照產品分類排序)
                    this.sortData();
                })
                .catch((error) => {
                    // console.dir(error);
                    alert(error.data);
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
        // 當按下新增/編輯產品的確認按鈕, 先檢查所有必填欄位是否已填妥, 再進行後續動作
        checkedBtnOperation(isAddProduct, productId) {
            let checkResult = "";
            
            //檢查所有必填欄位是否均已填妥, 如果得到空字串代表所有必填欄位均已填妥, 便關閉Modal視窗; 否則, 就跳出告警提醒使用者請確認
            checkResult = this.checkAllRequiredInput();
           
            if(checkResult !== "" ){
                alert(`"${checkResult}"不可為空白`);
                return;
            }else{
                //隱藏產品Modal視窗
                productModal.hide();
            }
            
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
        // 確認所有必填欄位是否已填妥
        checkAllRequiredInput(){
            // 當新建產品時, 各個必填欄位的值預設都是undefined, 故如果是在新建產品時就漏填資料, 也必須跳出告警視窗提醒使用者
            if (this.tempProduct.title === undefined || this.tempProduct.title === ""){
                return "標題";
            }else if(this.tempProduct.category === undefined || this.tempProduct.category === ""){
                return "分類";
            }else if(this.tempProduct.unit === undefined || this.tempProduct.unit === ""){
                return "單位";
            }else if(this.tempProduct.origin_price === undefined || this.tempProduct.origin_price === ""){
                return "原價";
            }else if(this.tempProduct.price === undefined || this.tempProduct.price === ""){
                return "售價";
            }else{
                return "";
            }
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
        //將資料依照分類排序
        //寫法參考自:https://ithelp.ithome.com.tw/articles/10225733
        sortData() {
            // 將API內的原始資料進行深層拷貝
            const copyProducts = JSON.parse(JSON.stringify(this.products)); //深層拷貝; 這段JSON.stringify(a);是指先將a物件改成字串, 這段JSON.parse(...);是指將內容物改成JSON格式

            //使用Object.values(...)把值取出來, 雖然這會失去原始資料內的id, 但因為是執行深層拷貝, 故不會影響到原本API內的原始資料, 在此僅作後台畫面上的顯示使用而已
            this.arrProducts = Object.values(copyProducts);

            //依據產品的類別進行排序, 目標是要將"相同類別的資料"擺放在一起, 待處理完成之後, 需在HTML畫面上以arrProducts作為呈現, 而非用products(即API內的原始資料)作呈現
            this.arrProducts.sort(function(a, b){
                if (a.category < b.category) {
                    return 1; //當a.category值 < b.category值為true時, 代表b項較a項更大, 故把b項放在a項的前面, 數值越大者將被排得越前面
                } else {
                    return -1; //當a.category值 < b.category值為false時, 代表b項較a項更小, 故把b項放在a項的後面, 數值越大者將被排得越前面
                }
            });
        },
        // 關閉"產品資料Modal"的方法
        closeProductModal(){
            productModal.hide();
        },
        // 關閉"刪除產品資料Modal"的方法
        closeDeleteModal(){
            delProductModal.hide();
        },
        // 取得網頁登入後的Token並儲存起來, 以利執行各種需要驗證使用者身份的API
        saveToken(){
            // //取得 Token（Token僅需要設定一次)
            const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

            //參考自axios文件的此處:https://github.com/axios/axios#global-axios-defaults
            axios.defaults.headers.common['Authorization'] = myToken;
        },
        // 當放入欲上傳的檔案後, 會觸發這個函式進行後續處理
        singleFileUpload(){

            alert(`圖片正在上傳中, 請稍後!`);

            // 因為產品Modal是用元件方式呈現, 故元件內資料與元件外的資料是彼此獨立的, 所以需要再次取得網頁登入後的Token並儲存起來, 以利執行上傳檔案的API
            this.saveToken();

            // 因為上傳檔案是以form格式, 其內容是類陣列的形式, 而檔案資訊位於files[0], 因此上傳後的檔案資訊需要用一個變數將其儲存起來, 以利稍後使用
            this.singleFileInfo = this.fileUpload.files[0];

            // 因為上傳檔案通常是以form表單方式, 而其實體內有一個屬性名為file-to-upload, 故在該屬性填入上傳檔案的資訊
            this.formData.append('file-to-upload', this.singleFileInfo);
            
            // 此上傳API本身需要有一個form表單的值一併帶入, 方可成功上傳, 在此請記得帶上form表單資料
            axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, this.formData)
            .then((response) =>{
                // console.log(response);

                // 上傳成功後, 圖片網址會在這裡response.data.imageUrl
                this.mainPicUrl = response.data.imageUrl;
                // console.log(this.mainPicUrl);
                alert(`圖片上傳成功`);

                // 完成上傳後, 將本次上傳資料清空, 且將form表單內所添加的屬性刪除, 避免持續添加一樣的屬性卻每次上傳成功後都顯示同一張圖片
                this.fileUpload.value = '';
                this.formData.delete('file-to-upload');

                // 將商品的主要圖片的欄位內容, 替換成剛剛上傳成功的檔案網址
                this.tempProduct.imageUrl = this.mainPicUrl;
            })
            .catch((error)=>{
                console.log(error);
                // 預計會顯示'檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'
                alert(error.data.message);
                // 完成上傳後, 將本次上傳資料清空, 且將form表單內所添加的屬性刪除, 避免持續添加一樣的屬性卻每次上傳成功後都顯示同一張圖片
                this.fileUpload.value = '';
                this.formData.delete('file-to-upload');
            })
        }

    },
    // 通常會使用使用import(見開頭第四行)搭配區域元件, 且區域元件裡面可以註冊很多個子元件 (請記得components的尾字有"s")
    components:{
        pagination, product_modal, delete_product_modal
    },
    //生命週期(在mounted此階段代表畫面上的DOM元素都已經生成完成了)
    mounted() {
        //在建立Bootstrap Modal元件的實體之前, 記得先在最外層宣告modal變數為'', 避免因為找不到該變數而報錯, 而當生命週期走到mounted時代表畫面都已經生成完畢, 此時進行抓取網頁DOM元素時才不會出錯, 故在此階段才將Modal實體化
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        // 抓取檔案上傳的DOM元素
        this.fileUpload = document.querySelector('#pic_file_uploadField');
        
        // 取得網頁登入後的Token並儲存起來, 以利執行各種需要驗證使用者身份的API
        this.saveToken();

        //呼叫檢查登入函式, 驗證人員身份, 如果尚未登入則透過函式導回登入畫面
        this.checkLogin();
    }

}).mount('#app');