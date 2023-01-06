// 引用Vue esm且引用createApp方法進來, 但其實是把整包都抓下來後, 取出createApp, 其實檔案大小跟整包抓下來是一樣大的
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 產品資料格式
createApp({
    //資料
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'cheetah116',
            //建立一個空陣列資料, 用來接收從axios回傳回來的商品資料
            products: [],
            //建立一個空的物件, 用來儲存單一產品的詳細資料
            singleProduct: {
            }
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
                    alert(error.data.message);

                    //因驗證登入失敗, 故執行跳轉到登入畫面; 返回上一層資料夾請使用兩個.符號
                    //參考資料:https://kumo.tw/article.php?id=8
                    location.href = '../login.html';
                })
        },
        getData() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
            .then((response) => {
                // console.log("取回資料成功");
                // console.log(response.data);
                this.products = response.data.products;
            })
            .catch((error) => {
                //console.dir(error);
                alert(error.data.message);
            })
        },
        //從HTML畫面上透過Vue的v-on指令綁定此函式, 且將畫面上選到的product資料當作參數, 傳給此函式使用
        showSingleProduct(item){
            //將參數儲存入singleProduct物件內, 這樣在HTML畫面上就可以透過Vue指令顯示對應資料出來
            this.singleProduct = item;
        }
    },
    //生命週期
    mounted() {
        //取得 Token（Token 僅需要設定一次, 參考資料同上
        const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        //參考自axios文件的此處:https://github.com/axios/axios#global-axios-defaults
        axios.defaults.headers.common['Authorization'] = myToken;

        //呼叫檢查登入函式, 驗證查看本頁面的人員身份
        this.checkLogin();
    }
}).mount('#app');