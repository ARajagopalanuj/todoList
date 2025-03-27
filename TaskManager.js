const express=require("express")
const app=express()
const con=require("./database")
const port=3000

app.use(express.json())

app.get("/getall" ,async(req,res)=>
{
    try{
    const result=await con.query("select *From todoList ")
    res.json(result.rows)
    }
    catch{
        res.json({status:"Error",error: err.message})
    }

});
app.post("/addData",async(req,res)=>
{
    try{
        const task=req.body.task
        const finalstatus=req.body.status||'Pending...';
        const result=await con.query("Insert into todoList(task,status)values($1,$2) Returning *",[task,finalstatus])
        res.json({status:"Task were Added"});
    }catch{
        res.json({status:"Error",error: err.message})
    }
});
app.put("/updateData",async(req,res)=>
{
    try{
    const id=req.body.id
    const result=await con.query("Update todoList Set status='Completed' where id=$1",[id])
    res.json({status:"Task are Updated"})
}catch{
    res.json({status:"Error",error: err.message})
}
});
app.delete("/deleteData",async(req,res)=>
   
{
    try{
        const id=req.body.id
        const restult=await con.query("delete from todoList where id=$1",[id])
        res.json({status:"Row has been deleted"})
    }catch{
        res.json({status:"error",error:err.message})
    }
});
app.listen(port,()=>(console.log("Server is running....."+port)));