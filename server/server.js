const express = require('express');
const morgan = require('morgan');

const PORT = 3001;
const dao = require('./dao'); // module for accessing the DB
const dayjs=require('dayjs')
app = new express();

app.use(morgan('dev'))
app.get('/',(req, res)=>{
    res.send(`Hi from the server, which is running on  http://localhost:${PORT}/`)
})

// app.get('/api/tasks', (req,res)=>{
//     dao.listAllTasks()
//         .then((tasks)=>{res.json(tasks)})
//         .catch((error)=>{res.status(500).json(error)} )
// })

// app.get('/api/tasks/important', (req,res)=>{
//     dao.listImportantTasks()
//         .then((tasks)=>{res.json(tasks)})
//         .catch((error)=>{res.status(500).json(error)} )
// })

// app.get('/api/tasks/private', (req,res)=>{
//     dao.listPrivateTasks()
//         .then((tasks)=>{res.json(tasks)})
//         .catch((error)=>{res.status(500).json(error)} )
// })

app.get('/api/tasks/:filter', async (req, res) => {
    const filter = req.params.filter;
    try {
        let tasks = await dao.getWithFilter(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));