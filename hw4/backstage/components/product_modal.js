export default {
    // 要將資料(tempProduct, isAddProduct, mainPictureUrl)及方法(checkedBtnOperation, createImagesUrlArray, closeProductModalWindow, singleFileUpload)傳入樣板裡, 否則會出現找不到Cannot read properties of undefined (reading 'xxxx')...等各種的紅字錯誤訊息或黃字提醒訊息
    props: ['tempProduct','isAddProduct', 'mainPictureUrl', 'checkedBtnOperation', 'createImagesUrlArray', 'closeProductModalWindow', 'singleFileUpload'],
    template:'#product_modal_template',
    
}