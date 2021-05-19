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

app.post('/api/tasks', (req,res) => {
    const task = req.body;
    if(!task){
        res.status(400).end();
    } else {
        dao.createTask(task)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((error) => res.status(500).json(error),
        );
    }
});

app.put('/api/tasks/:taskId', (req,res) => {
    if(!req.body.id){
        res.status(400).end();
    } else {
        const task = req.body;
        dao.updateTask(req.params.taskId,task)
            .then((id) => res.status(200).json({"id":id}))
            .catch((error) => res.status(500).json(error),
            );
    }
});

app.delete('/api/tasks/delete/:taskId', (req,res) => {
    dao.deleteTask(req.params.taskId)
        .then((id) => res.status(204).json("Selected task was deleted"))
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));