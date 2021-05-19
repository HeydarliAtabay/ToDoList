const express = require('express');
const morgan = require('morgan');

const PORT = 3001;
const dao = require('./dao'); // module for accessing the DB
const dayjs=require('dayjs')
app = new express();

app.use(morgan('dev'))
app.use(express.json())
app.get('/',(req, res)=>{
    res.send(`Hi from the server, which is running on  http://localhost:${PORT}/`)
})

 app.get('/api/tasks', (req,res)=>{
    dao.listAllTasks()
        .then((tasks)=>{res.json(tasks)})
         .catch((error)=>{res.status(500).json(error)} )
 })


app.get('/api/tasks/filter/:filter', async (req, res) => {
    const filter = req.params.filter;
    try {
        let tasks = await dao.getWithFilter(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/api/tasks/:id', async (req,res)=>{
    const id= req.params.id;
    try{
        let task=await dao.getTask(id)
        res.json(task)
    }
    catch(error){
        res.status(500).json(error)
    }
})

// app.post('api/tasks/add', async(req,res)=>{
//     let description=req.body.description
//     let important=req.body.important
//     let private=req.body.private
//     let deadline= req.body.private
//     let completed=req.body.completed
//     let user=req.body.user
//     try {
//         await dao.createTask({ description:description, important:important,
//         private:private, deadline:deadline, completed:completed, user:user });
//         //await dao.createTask({ description:description, user:user });
//         res.end();
//     } catch (error) {
//         res.status(500).json(error);
//     }
// })
app.post('/api/tasks', (req,res) => {
    const task = req.body;
    if(!task){
        res.status(400).end();
    } else {
        dao.createTask(task)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => res.status(500).json(error),
        );
    }
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));