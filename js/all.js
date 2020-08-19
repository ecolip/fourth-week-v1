/* global Vue */
/* eslint-disable */
import pagination from './pagination.js';

Vue.component('pagination', pagination);

new Vue({
  el: '#products',
  data: {
    user: {
      uuid: 'd4b6d215-5c7c-431c-adf1-f5c31b29ff6b',
      apiPath: 'https://course-ec-api.hexschool.io/api/',
      token: '',
    },
    list: [],
    tempData: {
      imageUrl: [],
    },
    pagination: {},
    loadingBtn: '',
  },
  created() {
    this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)hextoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.user.token}`;
    if(this.user.token == ''){ //如果token是空的就要返回登入頁面，防止沒有token的人進入
      window.location = 'login.html'; 
    }
    this.getProducts();
  },
  methods: {
    // 取得某一頁產品資料
    getProducts(page = 1) {
      const api = `${this.user.apiPath}${this.user.uuid}/admin/ec/products?page=${page}`;
      axios.get(api).then((res) => { //取得page頁的資料存到list，並把pagination資料取出做分頁參數用
        this.list = res.data.data; 
        this.pagination = res.data.meta.pagination;
      })
    },
    edit(item){
      const api = `${this.user.apiPath}${this.user.uuid}/admin/ec/product/${item.id}`;
      //完整的資料只能從後端取得，先從後端把資料取出來存到tempData
      axios.get(api).then((res) => {
        this.tempData = res.data.data;
      });
    },
    updateData() {
      if(this.tempData.id) { //更新會先執行edit()就會有id，而新增沒有id，以id做判斷
        const api = `${this.user.apiPath}${this.user.uuid}/admin/ec/product/${this.tempData.id}`;
        axios.patch(api, this.tempData).then((res) => {
          this.getProducts(); //後端資料更新後要重新把後端資料渲染到前端
        });
      }
      else{
        const api = `${this.user.apiPath}${this.user.uuid}/admin/ec/product`;
        this.tempData.id = (new Date()).getTime(); //取得unix時間設為新產品id
        axios.post(api, this.tempData).then((res) => {
          console.log('新增成功',res);
          this.getProducts();
        })
      }
    },
    remove(id) {
      const api = `${this.user.apiPath}${this.user.uuid}/admin/ec/product/${id}`;
      axios.delete(api).then((res) => {
        this.getProducts(this.pagination.current_page); //刪除某id項目後重新把後端全部產品資料拉出來存到list上，重新渲染
      })
    },
    clear(){
      this.tempData = {imageUrl: []};
    }
  },
});   