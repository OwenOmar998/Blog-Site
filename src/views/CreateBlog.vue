<template>
  <div class="add-comment">
    <div class="add-comment_title">
      <div v-if="fireBase.loadingData">
        <h1>Loading...</h1>
      </div>
      <div v-else>
        <div v-if="!fireBase.loggedIn">
          <div>
            <h1>
              Log in as author to
              {{ fireBase.createBlog ? "create new blog" : "edit the blog" }}
            </h1>
          </div>
        </div>
        <div v-else>
          <div v-if="!fireBase.user?.emailVerified">
            <h1>
              Verify your email to
              {{ fireBase.createBlog ? "create new blog" : "edit the blog" }}
            </h1>
          </div>
          <div v-else-if="fireBase.admin === undefined">
            <h1>
              You have to be an author to
              {{ fireBase.createBlog ? "create new blog" : "edit the blog" }}
            </h1>
          </div>
          <div v-else>
            <form
              @submit.prevent="
                fireBase.createForm(
                  addTitle,
                  addContent,
                  addImgURL,
                  fireBase.createBlog
                )
              "
            >
              <label><h1>Blog Title</h1></label>
              <input
                required
                style="
                  border: 2px solid black;
                  border-radius: 0.5rem;
                  padding: 0.5rem;
                "
                v-model="addTitle"
                v-autoresize
                placeholder="Add the blog title"
              />
              <label><h1>Blog Content</h1></label>
              <textarea
                required
                style="
                  border: 2px solid black;
                  border-radius: 0.5rem;
                  padding: 0.5rem;
                "
                class="blog-content"
                v-model="addContent"
                v-autoresize
                placeholder="Add the blog content"
              >
              </textarea>
              <h4 class="error" v-if="fireBase.errorMsg">
                {{ fireBase.errorMsg }}
              </h4>
              <label><h1>Blog Image</h1></label>
              <input
                required
                style="
                  border: 2px solid black;
                  border-radius: 0.5rem;
                  padding: 0.5rem;
                "
                v-model="addImgURL"
                v-autoresize
                placeholder="Add the blog image"
              />
              <button type="submit">
                <img src="../assets/images/send.png" alt="" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DirectiveBinding } from "vue";
import { useFireBase } from "../stores/FireBase";
import { useBlogPost } from "../stores/BlogPost";

export default defineComponent({
  name: "createBlog",
  setup() {
    const fireBase = useFireBase();
    const blogPost = useBlogPost();
    const addContent = fireBase.createBlog ? "" : blogPost.viewBlog.blogContent;
    const addTitle = fireBase.createBlog ? "" : blogPost.viewBlog.blogTitle;
    const addImgURL = fireBase.createBlog ? "" : blogPost.viewBlog.imgURL;

    return { addContent, addTitle, addImgURL, fireBase, blogPost };
  },
  components: {},
  directives: {
    autoresize: {
      beforeMount(el: HTMLElement, binding: DirectiveBinding) {
        el.style.overflow = "hidden";
        el.addEventListener("input", function () {
          this.style.height = "auto";
          this.style.height = `${this.scrollHeight}px`;
        });
      },

      mounted(el: HTMLElement, binding: DirectiveBinding) {
        el.style.overflow = "hidden";
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      },
    },
  },
});
</script>
