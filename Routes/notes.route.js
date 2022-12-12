const express = require("express");
const { NoteModel } = require("../Models/Note.model")


const notesRouter = express.Router();

notesRouter.get("/", async(req, res) => {
    const notes=await NoteModel.find()
    res.send(notes)
})
notesRouter.post("/create", async (req, res) => {
    const payload = req.body;
    // get token from header
    // verify token using jwt  ; these things required in all the notes request so will put it in middleware
    try {
        const new_note = new NoteModel(payload);
        await new_note.save()
        res.send({"msg":"Note created Successfuly"})
    } catch (error) {
        console.log(error);
        console.log({"err":"something went wrong with post request"})
    }

})
notesRouter.patch("/update/:noteID", async(req, res) => {
    // we need user's id?  - abc123 
    //const userID="abc123";
    // pass the userID along with the note fields;
    // but optimum way is sending the userID to token and receiving back from it;
    const noteID=req.params.noteID;
    const {userID}=req.body; // userId has been sent through middleWare;
    const userIDinNote=await NoteModel.findOne({_id:noteID})

    if(userID !== userIDinNote.userID){
            res.send("not authorized");
    }else{
        const payload=req.body;
        
        await NoteModel.findByIdAndUpdate({_id: noteID},payload)
        res.send({"msg":"note updated successfuly"})
    }
   
})

notesRouter.delete("/delete/:noteID", async(req, res) => {
    const noteID=req.params.noteID;
    const {userID}=req.body; // userId has been sent through middleWare;
    const userIDinNote=await NoteModel.findOne({_id:noteID})

    if(userID !== userIDinNote.userID){
            res.send({"err":"not authorized"});
    }else{
        const noteID=req.params.noteID;
        await NoteModel.findByIdAndDelete({_id: noteID})
        res.send({"msg":"note deleted successfuly"})
    }
   
})

module.exports = {
    notesRouter
}