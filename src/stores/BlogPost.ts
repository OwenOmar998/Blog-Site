import { defineStore } from "pinia";
interface Blog {
  id: string;
  blogTitle: string;
  blogAuthor: string;
  blogContent: string;
  imgURL: string;
  date: string;
}
export const useBlogPost = defineStore("BlogPost", {
  state: () => ({
    viewBlog: {} as Blog,
    firstBlog: 0 as number,
    page: 1 as number,
    charNumber: 200 as number,
    blogPerPage: 3 as number,

    blogInPage: [] as Blog[],
    previousPage: false,
    nextPage: true,

    Blogs: [] as Blog[],
  }),

  actions: {
    nextPrevious(p: number) {
      this.firstBlog = this.firstBlog + this.blogPerPage * p;

      this.resizeVar();
    },
    resizeVar() {
      this.charNumber =
        window.innerWidth >= 1200
          ? 200
          : window.innerWidth >= 960
          ? 150
          : window.innerWidth >= 620
          ? 100
          : 200;
      this.blogPerPage = window.innerWidth > 620 ? 3 : 1;
      if (this.blogPerPage === 3) {
        this.firstBlog = Math.floor(this.firstBlog / 3) * 3;
      }
      this.page = Math.floor(this.firstBlog / this.blogPerPage) + 1;
      if (this.page > 1) this.previousPage = true;
      else this.previousPage = false;

      if (this.page < this.Blogs.length / this.blogPerPage)
        this.nextPage = true;
      else this.nextPage = false;
      this.blogInPage = this.Blogs.slice(
        this.firstBlog,
        this.firstBlog + this.blogPerPage
      );
    },
  },
});
