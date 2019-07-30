<template>
  <div class="message-box">
    <textarea
      class="message-box__text-box"
      @change="isTypingNow"
      v-model="message"
      name="Text1"
      cols="20"
      rows="2"
    ></textarea>
    <button @click="sendMessage">Gonder</button>
  </div>
</template>

<script>
import { EventBus } from "../../helpers/EventBus/EventBus";
export default {
  data() {
    return {
      message: null,
      isTyping: false
    };
  },
  methods: {
    sendMessage() {
      if (this.message) EventBus.$emit("messageReadyToSend", this.message);
      this.message = null;
      EventBus.$emit("typingDone");
    },
    isTypingNow() {
      EventBus.$emit("isTypingNow");
    }
  }
};
</script>

<style>
textarea {
  width: 100%;
}
</style>
