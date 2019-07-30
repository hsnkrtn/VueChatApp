<template>
  <div class="chat-container">
    <ul class="messages">
      <li class="message" v-for="(message,index) in messages" :key="index">{{message}}</li>
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
  },
  props:{
    messages:{
      type:Array,
      required:false,
      default:()=>([])
    }
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
