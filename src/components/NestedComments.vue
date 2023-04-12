<template>
  <div class="comment__container" :class="showReply === true ? 'opened' : ''">
    <div class="comment__card" ref="comments">
      <h3 class="comment__title">{{ comments?.displayName }}</h3>
      <h4 class="comment__title">{{ comments?.date }}</h4>
      <p>
        {{ comments?.body }}
      </p>
      <div class="comment__card-footer">
        <div class="show-replies" @click="showReplyText">reply</div>

        <div
          v-show="numComments !== 0"
          class="show-replies"
          @click="toggleReply"
        >
          <span v-if="numComments === 1">1 reply</span>
          <span v-else>{{ numComments }} replies</span>
          <i :class="showReplies ? 'fa fa-angle-up' : 'fa fa-angle-down'"></i>
        </div>
      </div>
    </div>

    <NestedComments
      v-for="(nesteadComment, index) in comments?.replies"
      :numComments="nesteadComment.replies.length"
      :key="index"
      :comments="nesteadComment"
      :showReply="showReplies"
      :level="level + ' ' + index.toString()"
    ></NestedComments>

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
          @click="addCommentToBlog()"
        >
          <img src="../assets/images/send.png" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useFireBase } from "../stores/FireBase";
import { ref, computed, DirectiveBinding, PropType, onMounted } from "vue";

interface comment {
  displayName: string;
  body: string;
  date: number;
  replies: comment[];
}

export default defineComponent({
  setup(props) {
    const fireBase = useFireBase();
    const showReplies = ref(false);
    const addComment = ref("");
    const textId = computed(() => {
      const length = addComment.value.length;
      return length === 0 ? `disabled` : "";
    });

    return { showReplies, fireBase, addComment, textId };
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
        const commentDiv = this.$refs.comments as HTMLElement;
        commentDiv.scrollIntoView({ behavior: "smooth" });
      });
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
    addCommentToBlog() {
      document.querySelectorAll("textarea").forEach((el) => {
        if (el.parentElement?.classList.contains("comment__card"))
          el.parentNode?.parentElement?.classList.remove("opened");
      });
      this.fireBase.addNestedComment(this.$props.level, this.addComment);
      this.addComment = "";
    },
  },
  name: "NestedComments",
  props: {
    comments: {
      type: Object as PropType<comment>,
    },
    showReply: {
      type: Boolean,
    },
    level: {
      type: String,
    },
    numComments: {
      type: Number,
    },
  },
});
</script>
