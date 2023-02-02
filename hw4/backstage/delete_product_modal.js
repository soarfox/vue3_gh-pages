export default {
    // 要將資料(tempProduct)及方法(deleteProduct, closeDeleteModalWindow)傳入樣板裡
    props: ['tempProduct','deleteProduct','closeDeleteModalWindow'],
    template: '#delete_product_modal_template',
}