<template>
  <div class="container">
    <h1>Post</h1>
    <div v-if="fireBase.loadingData">
      <div class="blog-post" style="display: flex">
        <h2>Loading...</h2>
      </div>
    </div>
    <div v-else-if="fireBase.getDataError">
      {{ fireBase.getDataError }}, Try again
    </div>
    <div v-else>
      <div v-if="blogPost.blogInPage.length === 0">
        <div class="blog-post" style="display: flex">
          <h2>No Blogs avaliable</h2>
        </div>
      </div>
      <div v-else>
        <div
          class="blog-post"
          v-for="blog in blogPost.blogInPage"
          :key="blog.id"
        >
          <div class="blog-post_img">
            <img :src="blog.imgURL" alt="" />
          </div>
          <div class="blog-post_info">
            <h2 class="blog-post_title">{{ blog.blogTitle }}</h2>
            <div class="blog-post_date">
              <h4>By: {{ blog.blogAuthor }} |</h4>
              <h4>&nbsp;{{ blog.date }}</h4>
            </div>
            <p class="blog-post_text">
              {{ blog.blogContent.substring(0, blogPost.charNumber) }}...
            </p>
            <router-link
              @click="fireBase.getBlog(blog.id)"
              :to="'/viewBlog' + blog.id"
              ><button class="blog-post_btn">Read More</button></router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="Pagination">
    <button
      class="btn_next"
      v-show="blogPost.previousPage"
      @click="blogPost.nextPrevious(-1)"
    >
      Page: {{ blogPost.page - 1 }}
    </button>

    <button
      class="btn_pre"
      v-show="blogPost.nextPage"
      @click="blogPost.nextPrevious(1)"
    >
      Page: {{ blogPost.page + 1 }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useBlogPost } from "../stores/BlogPost";
import { useFireBase } from "../stores/FireBase";

export default defineComponent({
  name: "HomeView",
  setup() {
    const blogPost = useBlogPost();
    const fireBase = useFireBase();
    fireBase.getToken();
    blogPost.resizeVar;
    window.addEventListener("load", blogPost.resizeVar);
    window.addEventListener("resize", blogPost.resizeVar);
    return { blogPost, fireBase };
  },

  components: {},
});
</script>
