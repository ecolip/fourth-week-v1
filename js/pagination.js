export default {
  template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: pages.current_page === 1}">
        <a class="page-link" href="#" @click.prevent="prePage(pages.current_page)">Previous</a>
      </li>
      <li class="page-item" :class="{ active: i === pages.current_page}" v-for="i in pages.total_pages" :key="i">
        <a class="page-link" href="#" @click.prevent="updatePage(i)">{{ i }}</a>
      </li>
      
      <li class="page-item" :class="{ disabled: pages.current_page === pages.total_pages}">
        <a class="page-link" href="#" @click.prevent="nextPage(pages.current_page)">Next</a>
      </li>
    </ul>
  </nav>`,
  props: ['pages'],
  methods: {
    updatePage(i) {
      this.$emit('update', i);
    },
    prePage(num) {
      if(num-1 > 0){
        this.$emit('previous', num-1);
      }
    },
    nextPage(num) {
      if(num+1 <= this.pages.total_pages) {
        this.$emit('next', num+1)
      }
    },
  }
}