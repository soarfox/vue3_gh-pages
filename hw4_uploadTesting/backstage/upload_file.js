export default {
    // 要將資料()及方法(singleFileUpload)傳入樣板裡, 否則會出現找不到Cannot read properties of undefined (reading 'xxxx')...等各種的紅字錯誤訊息或黃字提醒訊息
    props:['singleFileUpload',],
    template:'#upload_file_template'
}