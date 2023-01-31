export default {
    // 要將資料(tempProduct, isAddProduct)及方法(checkedBtnOperation, createImagesUrlArray)傳入樣板裡, 否則會出現找不到Cannot read properties of undefined (reading 'imageUrl')...等各種的紅字錯誤訊息或黃字提醒訊息
    props: ['tempProduct','isAddProduct', 'checkedBtnOperation', 'createImagesUrlArray'],
    template:'#product_modal_template',
}