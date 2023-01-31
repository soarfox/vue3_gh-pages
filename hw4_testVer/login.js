// 引用Vue esm且引用createApp方法進來, 但其實是把整包都抓下來後, 取出createApp, 其實檔案大小跟整包抓下來是一樣大的
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// Vue格式
createApp({
    data() {
        return {
            //在HTML畫面上已使用v-model指令進行雙向綁定, 故在此可以接收到使用者輸入的資料內容
            user:{
                username:'',
                password:''
            }
        }
    },
    //方法(請記得尾字有"s")
    methods: {
        
        login(){
            const url = 'https://vue3-course-api.hexschool.io/v2'; //固定站點位置
            
            axios.post(`${url}/admin/signin`, this.user)
            .then((response) => {
                // console.log(response);
                
                // 使用解構的方式來取得token與token的expired(到期日), 每次登入後, token都會不同
                const { token, expired } = response.data;
                
                //把token和expired儲存在cookie內
                //直接複製MDN Cookie 文件( https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie )裡, 第三個範例內的其中一行程式碼來用, 並且把自訂義名稱改成想要的名稱; 將expired轉成(原本的)unix timestamp格式, 進行儲存
                document.cookie = `hexToken = ${token}; expires = ${new Date(expired)}; path=/`;
                
                //因上述登入成功, 故執行跳轉到後台的畫面
                //參考資料:https://kumo.tw/article.php?id=8
                location.href = './backstage/editProduct.html';
            })
            .catch((error)=>{
                // console.dir(error);
                alert(error.data.error.message);
            });
        },
    },
}).mount('#app');