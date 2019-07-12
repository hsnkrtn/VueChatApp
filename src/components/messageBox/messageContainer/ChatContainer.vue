<template>
  <div class="chat-container">
    <ul class="messages">
      <li class="message">Message</li>
      <li class="message">Message</li>
      <li class="message">Message</li>
      <li class="message">Message</li>
    </ul>
    <message-box />
  </div>
</template>

<script>
import Message from "../Message";
import MessageBox from "../MessageBox";
export default {
  components: {
    Message,
    MessageBox
  }
};
</script>

<style>
.chat-container {
  border: greenyellow;
  border-width: 5px;
  border-style: solid;
}
</style>
