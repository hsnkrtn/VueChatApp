let newUser={
    userName: "",
    password:"",
    id: "",
    gender: "",
    dateOfBirth:"",
    avatarUrl:"",
    friendshipRequests: [
        {
            from: "public",
            to: "",
            avatarURL: "",
            approved: true
        }
    ],
    friends: [
        {
            userName: "public",
            Id: "-",
            avatarURL: ""
        }
    ],
    messages: [
        {
            Id: "12345",
            from: "",
            gelesen: true,
            to: "public",
            text: "Hallo Ik ben nieuw",
            avatarUrl:null
        }
    ]
} 
export default newUser;
