<template>
  <div v-if="fireBase.loadingData">
    <div class="blog-post" style="display: flex">
      <h2>Loading...</h2>
    </div>
  </div>
  <div v-else>
    <div class="title">
      <h1>{{ blogPost.viewBlog.blogTitle }}</h1>
    </div>
    <div class="image-container">
      <div class="view-blog-post">
        <img :src="blogPost.viewBlog.imgURL" alt="" />

        <div class="view-blog-post_info">
          <div class="view-blog-post_date">
            <h3>By: {{ blogPost.viewBlog.blogAuthor }} |</h3>
            <h3>&nbsp;{{ blogPost.viewBlog.date }}</h3>
          </div>
          <p class="view-blog-post_text">
            {{ blogPost.viewBlog.blogContent }}
          </p>
          <div class="edit">
            <div class="edit-blog">
              <button @click="fireBase.goToEdit">edit</button>
            </div>
            <div class="delete">
              <button @click="fireBase.deleteBlog(blogPost.viewBlog.id)">
                delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="comment__card" id="comments">
        <h1>comments</h1>
        <div class="comment__card-footer">
          <div class="show-replies" @click="showReplyText">add comment</div>
          <div
            v-show="fireBase.comments.length !== 0"
            class="show-replies"
            @click="toggleReply"
          >
            <span v-if="fireBase.comments.length === 1">1 comment</span>
            <span v-else>{{ fireBase.comments.length }} comments</span>
            <i :class="showReplies ? 'fa fa-angle-up' : 'fa fa-angle-down'"></i>
          </div>
        </div>
      </div>
    </div>
    <div v-if="fireBase.comments.length === 0">
      <div class="container">
        <div class="comment__card">
          <h2>No comments avaliable</h2>
        </div>
      </div>
    </div>
    <div
      v-else
      class="container"
      v-for="(comment, index) in fireBase.comments"
      :key="index"
    >
      <NestedComments
        ref="commentDiv"
        :comments="comment"
        :numComments="comment.replies?.length"
        :level="index.toString()"
        :showReply="showReplies"
      >
        ></NestedComments
      >
    </div>

    <div class="container">
      <div class="comment__container" ref="textAreaDiv">
        <div class="comment__card">
          <label
            ><h3>{{ fireBase.user?.displayName }}</h3></label
          >
          <textarea
            ref="textAreaRef"
            v-model="addComment"
            v-autoresize
            placeholder="Write a comment..."
          >
          </textarea>
          <button
            :disabled="addComment.length === 0"
            :id="textId"
            @click="
              fireBase.addComment(addComment);
              addComment = '';
              hideTextArea();
            "
          >
            <img src="../assets/images/send.png" alt="" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useBlogPost } from "../stores/BlogPost";
import { useFireBase } from "../stores/FireBase";
import { DirectiveBinding } from "vue";
import { addComment } from "@babel/types";
import NestedComments from "@/components/NestedComments.vue";

export default defineComponent({
  name: "viewBlog",
  beforeCreate() {
    console.log(this.$route.path.split("/")[2]);
    useFireBase().getBlog(this.$route.path.split("/")[2]);
  },
  setup() {
    const showReplies = ref(false);
    const showText = ref(false);
    const addComment = ref("");

    const blogPost = useBlogPost();
    const fireBase = useFireBase();

    blogPost.resizeVar;
    window.addEventListener("load", blogPost.resizeVar);
    window.addEventListener("resize", blogPost.resizeVar);
    const textId = computed(() => {
      const length = addComment.value.length;
      return length === 0 ? `disabled` : "";
    });

    return {
      blogPost,
      addComment,
      fireBase,
      textId,
      showReplies,
      showText,
    };
  },

  directives: {
    autoresize: {
      beforeMount(el: HTMLElement, binding: DirectiveBinding) {
        el.style.overflow = "hidden";
        el.addEventListener("input", function () {
          this.style.height = "auto";
          this.style.height = `${this.scrollHeight}px`;
        });
      },
    },
  },
  methods: {
    toggleReply() {
      this.showReplies = !this.showReplies;
      if (this.showReplies === false) {
        const textAreaDiv = this.$refs.textAreaDiv as HTMLDivElement;
        textAreaDiv.classList.remove("opened");
      }

      this.$nextTick(() => {
        const commentDiv = document.getElementById(
          "comments"
        ) as HTMLTextAreaElement;
        commentDiv.scrollIntoView({ behavior: "smooth" });
      });
    },
    hideTextArea() {
      const textAreaDiv = this.$refs.textAreaDiv as HTMLDivElement;
      textAreaDiv.classList.remove("opened");
    },
    showReplyText() {
      document.querySelectorAll("textarea").forEach((el) => {
        if (el.parentElement?.classList.contains("comment__card"))
          el.parentNode?.parentElement?.classList.remove("opened");
      });
      const textAreaDiv = this.$refs.textAreaDiv as HTMLDivElement;
      textAreaDiv.classList.add("opened");

      this.showReplies = true;
      this.$nextTick(() => {
        const textAreaRef = this.$refs.textAreaRef as HTMLTextAreaElement;
        textAreaRef.focus();
      });
    },
  },
  components: { NestedComments },
});
</script>
