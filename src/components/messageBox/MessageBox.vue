<template>
  <div class="message-box">
    <textarea class="message-box__text-box" v-model="message" name="Text1" cols="20" rows="2"></textarea>
    <button @click="sendMessage">Gonder</button>
  </div>
</template>

<script>
import { EventBus } from "../../helpers/EventBus/EventBus";
export default {
  data() {
    return {
      message: null
    };
  },
  methods: {
    sendMessage() {
      EventBus.$emit("messageReadyToSend", this.message);
     // if (this.message) this.$emit("messageReadyToSend", this.message);
      console.log("im in Message Box", this.message);
    }
  }
};
</script>

<style>
textarea {
  width: 100%;
}
</style>
