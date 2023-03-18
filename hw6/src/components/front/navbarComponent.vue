<template>
  <!-- 修改字體為粗體fw-bold, 參考官網: https://getbootstrap.com/docs/5.0/utilities/text/#font-weight-and-italics -->
  <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top fw-bold" style="background-color: #FFEEDD;">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">米諾可icon</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{name: 'aboutUs'}" class="nav-link">關於我們
            </router-link>
          </li>
          <li class="nav-item">
            <!-- 在此使用動態方式把元件名稱加入進來(需與router/index.js內的name對應), 且記得要加上超連結的名稱, 例如:'新頁面' -->
            <router-link :to="{name: 'productsPage'}" class="nav-link">美味餐點
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'cartPage'}" class="nav-link">查看購物車
            </router-link>
          </li>
          <li class="nav-item">
            <!-- 內容可參考: https://kerickkkkk.github.io/homeless/#/service -->
            <router-link :to="{name: 'servicePage'}" class="nav-link">常見問題
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>