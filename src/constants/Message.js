import Guid from "guid";
class Message{
    constructor(){
        this.id=Guid.raw()
        this.sendingTime=null
        this.from=null
        this.gelesen=false
        this.to=null
        this.text=null
        this.avatarUrl=null
    }
}
export default Message;