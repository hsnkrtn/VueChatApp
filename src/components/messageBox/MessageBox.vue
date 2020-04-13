<template>
  <div class="message-box">
    <textarea
      class="message-box__text-box"
      v-model="messageText"
      name="Text1"
      cols="20"
      rows="2"
    ></textarea>
    <button @click="sendMessage">Gonder</button>
  </div>
</template>

<script>
import { EventBus } from "../../helpers/EventBus/EventBus";
import Guid from "guid";
export default {
  data() {
    return {
      messageText: null,
      id: null,
      isTyping: false,
    };
  },
  methods: {
    sendMessage() {
      console.log('text from component',this.messageText)
      this.$store.dispatch("sendMessage", this.messageText);
      this.$store.dispatch("setMyMessages");

      this.reset();
    },
    reset() {
      this.isTyping = false;
      this.messageText = null;
      this.id = null;
    },
  },
  watch: {
    message(newVal) {
      if (newVal) this.isTyping = true;
    },
    isTyping(newVal) {
      if (newVal) {
        this.id = Guid.raw();
        EventBus.$emit("isTypingNow", this.id);
      }
    },
    currentUser(newVal) {
      if (newVal) {
        if (this.message) EventBus.$emit("typingDone", this.id);
        this.reset();
      }
    },
  },
  props: {
    currentUser: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
};
</script>

<style>
textarea {
  width: 100%;
}
</style>
