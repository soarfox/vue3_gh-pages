export default {
    // // 要將資料(singleProduct, cartList)及方法(addToCart)傳入樣板裡, 否則會出現找不到Cannot read properties of undefined (reading 'xxxx')...等各種的紅字錯誤訊息或黃字提醒訊息
    props: ['singleProduct', 'cartList', 'addToCart'],
    data(){
        return{
            // 在Modal內, 將預設要加入購物車內的產品數量設為1
            qty: 1,
        };
    },
    methods:{
        // 當使用者在Modal內進行加入購物車的行為時, 透過此emit方法將產品id與數量(productId, orderQty)往外部傳遞出去, 且由外部方法addToCart接收資料
        emitGetModalProductIdAndQty(productId, orderQty){
            // console.log(productId, orderQty);

            // 這個emit的事件是可以自訂義名稱(英文大小寫皆可), 但是當放在元件的方法需告時, 因為HTML的屬性名稱僅限小寫英文字母, 故需要把大寫字母轉成小寫, 且用"-"符號連接
            this.$emit('emitInfoFromComponent', productId, orderQty);
            // 或者直接就將這個emit事件名稱使用小寫英文字母並用"-"串接符號方式, 此二種方式效果相同
            // this.$emit('emit-info-from-component', productId, orderQty); 

            // 當使用者在Modal內將某產品(與其數量)加入購物車之後, 需要將物品的數量恢復為1, 否則就會一直維持剛剛使用者訂購的那個數量不變(因為Modal的qty有使用v-model綁定的關係)
            this.qty = 1;
        },
    },
    template:'#product_modal_template',
}