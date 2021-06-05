const express = require('express');
const morgan = require('morgan');

const PORT = 3001;
const dao = require('./dao'); // module for accessing the DB for tasks
const userDao= require('./user_dao') // module for accessing the DB for users

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy; // username and password for login

const session= require('express-session')

app = new express();

app.use(morgan('dev'))
app.use(express.json())
app.get('/',(req, res)=>{
    res.send(`Hi from the server, which is running on  http://localhost:${PORT}/`)
})


passport.use(new LocalStrategy(
    function(username, password, done) {
      userDao.getUser(username, password).then((user) => {
        if (!user)
          return done(null, false, { message: 'Incorrect username and/or password.' });
          
        return done(null, user);
      }).catch(err=>{
          done(err)
      })
    }
  ));

  // serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // starting from the data in the session, we extract the current (logged-in) user
  passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
      .then(user => {
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
  });

// checking whether the user is authenticated or not
  const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
      return next();
    
    return res.status(401).json({ error: 'not authenticated'});
  }

// set up the session
  app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'Ondan ona ondan ona, cay verun limonnan ona',
    resave: false,
    saveUninitialized: false 
  }));

  // tell passport to use session cookies
  app.use(passport.initialize())
  app.use(passport.session())

//  app.get('/api/tasks', isLoggedIn,(req,res)=>{
//     dao.listAllTasks()
//         .then((tasks)=>{res.json(tasks)})
//          .catch((error)=>{res.status(500).json("Getting Tasks from server was unsuccesful   "+ error)} )
//  })

 app.get('/api/tasks', isLoggedIn, async (req, res) => {
  try {
    const tasks = await dao.listAllTasks(req.user.id);
    res.json(tasks);
  } catch(err) {
    res.status(500).json("Getting Tasks from server was unsuccesful   "+ error) ;
  }
});

app.get('/api/tasks/filter/:filter', isLoggedIn, async (req, res) => {
    const filter = req.params.filter;
    try {
        let tasks = await dao.getWithFilter(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json(`There was error while getting tasks with selected filter: ${filter}   `+error);
    }
});

app.get('/api/tasks/:id', async (req,res)=>{
    const id= req.params.id;
    try{
        let task=await dao.getTask(id)
        res.json(task)
    }
    catch(error){
        res.status(500).json(`Cannot get a task with selected id:${id}   `+ error)
    }
})

// app.post('/api/tasks', isLoggedIn, (req,res) => {
//     const task = req.body;
//     if(!task){
//         res.status(400).end();
//     } else {
//         dao.createTask(task,req.user.id)
//             .then((id) => res.status(201).json(`New task with id:${id} was added to the DB`))
//             .catch((error) => res.status(500).json("Adding a new task was unsuccessful    "+ error),
//         );
//     }
// });

app.post('/api/tasks', isLoggedIn, async (req,res)=>{
 
  const task = req.body

  try {
    await dao.createTask(task, req.user.id);
    res.status(201).end();
  } catch(err) {
    res.status(503).json({error: `Database error during the creation of exam ${exam.code}.`});
  }
})

//dao.updateTask(req.params.taskId,task)

app.put('/api/tasks/update/:taskId', isLoggedIn, async (req,res) => {
  const task = req.body
 
  try {
    await dao.updateTask(req.params.taskId,task);
    res.status(201).end();
  } catch(err) {
    res.status(503).json({error: `Database error during the creation of exam ${exam.code}.`});
  }
        
   
});

app.put('/api/tasks/update/completed/:taskId',  async(req,res) => {
        const id = req.params.taskId;
        try{
            let task=await dao.updateTaskStatusCompleted(id)
            res.json(`Status of task with id: ${id}  was changed to Completed`)
        }
        catch(error){
            res.status(500).json(`Error while updating the status of the task with id: ${id}   `+ error)
        }
    
});
app.put('/api/tasks/update/uncompleted/:taskId',  async(req,res) => {
    const id = req.params.taskId;
    try{
        let task=await dao.updateTaskStatusUncompleted(id)
        res.json(`Status of task with id: ${id}  was changed to Uncompleted`)
    }
    catch(error){
        res.status(500).json(`Error while updating the status of the task with id: ${id}   `+ error)
    }

});

app.delete('/api/tasks/delete/:taskId', (req,res) => {
    dao.deleteTask(req.params.taskId)
        .then((id) => res.status(204).json(`Selected task with id:${req.params.taskId} was deleted`))
        .catch((err) => res.status(500).json(`Error while deleting the task with id:${req.params.taskId}  `+err),
        );
});


/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
        });
    })(req, res, next);
  });
  
  // ALTERNATIVE: if we are not interested in sending error messages...
  /*
  app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user);
  });
  */
  
  // DELETE /sessions/current 
  // logout
  app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
  });
  
  // GET /sessions/current
  // check whether the user is logged in or not
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Unauthenticated user!'});;
  });

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));