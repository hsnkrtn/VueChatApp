<template>
  <div class="chat-container">
    <div id="mesBox" class="messages">
      <div
        :class="classNameForMessage(message.from)"
        v-for="(message,index) in messages"
        :key="index"
      >{{displayMessageInfo(message)}}</div>
    </div>
    <message-box :currentUser="currentUser" />
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
  mounted() {
    var objDiv = document.getElementById("mesBox");
    objDiv.scrollTop = objDiv.scrollHeight;
  },
  updated() {
    var objDiv = document.getElementById("mesBox");
    objDiv.scrollTop = objDiv.scrollHeight;
  },
  methods: {
    classNameForMessage(userName) {
      const defaultClassName = "message";
      return {
        [`${defaultClassName}`]: true,
        [` ${defaultClassName}__myMessage`]: userName === this.myUserName,
        [` ${defaultClassName}__othersMessage`]: userName !== this.myUserName
      };
    },
    displayMessageInfo(message) {
      return message.from === this.myUserName
        ? `${message.text} ${message.from}`
        : `${message.from} ${message.text}`;
    }
  },
  props: {
    messages: {
      type: Array,
      required: false,
      default: () => []
    },
    currentUser: {
      type: Object,
      required: false,
      default: () => ({})
    },
    myUserName: {
      Type: String,
      required: true
    }
  }
};
</script>
<style lang="scss">
.chat-container {
  border: greenyellow;
  border-width: 5px;
  border-style: solid;
}
.messages {
  height: 500px;
  width: 100%;
  overflow: auto;
  padding: "10px";
}
.message {
  color: black;
  &__myMessage {
    text-align: right;
    font-weight: bold;
    border-radius: 10%;
    background-color: #bada55;
    color: white;
    padding-right: 5px;
  }
  &__othersMessage {
    border-radius: 10%;
    background-color: LightBlue;
    color: white;
    padding-left: 5px;
    text-align: left;
  }
}
</style>
