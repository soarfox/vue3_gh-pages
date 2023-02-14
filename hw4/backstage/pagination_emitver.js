// 匯出paginaton檔案, 這是使用emit的版本
export default {
    // 定義一個props, 將page傳進來, 也將取得產品的方法當成事件傳進來使用
    props:['innerpages', 'getProducts'],
    
    // 分頁(pagination)引用自Bootstrap5官網 : https://getbootstrap.com/docs/5.0/components/pagination/

    // ---------- template程式碼的註解 -----------

    // 若想看看資料有沒有成功傳進來, 直接把值渲染到畫面上查看, 在template內加入{{ innerpages }}來查看此物件的內容

    // ----前一頁的按鈕 emit版本-----
    // 如果當前所在的頁面並沒有前一頁, 則可將Previous加上一個disabled樣式
    // 在<a>標籤內使用@click方法, 透過pagination元件來觸發$emit()方法, 且在emit()內是一個指定的事件名稱change-page, 且後方可以帶入一個參數innerpages.current_page - 1, 將當前頁數減1, 代表就是前一頁的意思, 因此可以實現往前一頁的功能, 請記得在@click後方加上.prevent, 防止其跳頁後回到畫面的頂端
    

    // ----當前頁面的按鈕 emit版本-----
    // 在此將:key的內容加上一個字串'pp', 因為page是一個數字, 而key儘可能使用唯一值, 故幫其加上一個字串, 使其更具唯一性; 使用:class="{...}"套用樣式, 如果當前的page值等於current_page值時, 則套用active樣式, 使頁數數字能夠以藍底色顯示

    // emit版本要做的事情, 概述:在做跳頁的時候, 透過emit來觸發外層事件, 過程中一樣會透過pagination這個元件來觸發外層的getData()方法
    // 在<a>標籤內使用@click方法, 透過pagination元件來觸發$emit()方法, 且在emit()內是一個指定的事件名稱change-page, 且後方可以帶入一個參數page 
    

     // ----後一頁的按鈕 emit版本-----
     // 如果當前所在的頁面並沒有後一頁, 則可將Next加上一個disabled樣式
     // 在<a>標籤內使用@click方法, 透過pagination元件來觸發$emit()方法, 且在emit()內是一個指定的事件名稱change-page, 且後方可以帶入一個參數innerpages.current_page + 1, 將當前頁數加1, 代表就是後一頁的意思, 因此可以實現往後一頁的功能, 請記得在@click後方加上.prevent, 防止其跳頁後回到畫面的頂端
     // --------------
     

     // --------------------------

    template: `<nav aria-label="Page navigation example">

    <ul class="pagination">

      <li class="page-item"
        :class="{ disabled: !innerpages.has_pre}">
        <a class="page-link" href="#" aria-label="Previous"
          @click.prevent="$emit('change-page', innerpages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      

      <li class="page-item"
        :class="{ active: page === innerpages.current_page }"
        v-for="page in innerpages.total_pages"
        :key="page + 'pp'">
            <a class="page-link" href="#" @click.prevent="$emit('change-page', page)">{{ page }}</a>
      </li>


      <li class="page-item"
        :class="{disabled: !innerpages.has_next}">
        <a class="page-link" href="#" aria-label="Next"
        @click.prevent="$emit('change-page', innerpages.current_page + 1)"
       >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>`
}