import Guid from "guid";
class newFriendShipRequest{
    constructor(){
        this.id=Guid.raw()
        this.from= null
        this.to= null
        this.avatarUrl=null
        this.approved= false
        this.sendingTime=null
    }
}
export default newFriendShipRequest;