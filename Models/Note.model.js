const mongoose=require("mongoose")

const noteSchema=mongoose.Schema({
    title:String,
    note:String,
    category:[],
    userID: String,// u can't use _id here as mongodb will created _id for notes as well;
})

const NoteModel=mongoose.model("note",noteSchema)

module.exports={
    NoteModel
}