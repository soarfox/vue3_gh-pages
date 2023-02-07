export default {
    // 要將資料(tempProduct, isAddProduct)及方法(checkedBtnOperation, createImagesUrlArray, closeProductModalWindow)傳入樣板裡, 否則會出現找不到Cannot read properties of undefined (reading 'xxxx')...等各種的紅字錯誤訊息或黃字提醒訊息
    props: ['tempProduct','isAddProduct', 'checkedBtnOperation', 'createImagesUrlArray', 'closeProductModalWindow'],
    template:'#product_modal_template',
}