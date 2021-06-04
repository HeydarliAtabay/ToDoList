import { React, useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Container, Row, Col, Button, Alert } from 'react-bootstrap/';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

import AppTitle from './components/AppTittle';


import Navigation from './components/Navigation';
import Filters from './components/Filters';
import ContentList from './components/ContentList';
import ModalForm from './components/ModalForm';

import { LoginForm, LogoutButton } from './components/LoginComponent';


import API from './API'

import { BrowserRouter as Router, Route, useParams, useHistory, Switch, Redirect } from 'react-router-dom';

dayjs.extend(isToday);

function App() {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading]=useState(true)//this for checking the loading at mount
  const [dirty, setDirty] =useState(true)
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');


  // use an enum
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);



  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        await API.getUserInfo();
        setLoggedIn(true);
      } catch(err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  // for getting all tasks
  // useEffect(() => {
  //   if(dirty){
  //     API.loadAllTasks().then(newTask=>{
  //       setTaskList(newTask)
  //       setLoading(false)
  //       setDirty(false)
  //      })
  //   }
    
  // }, [dirty])

  useEffect(()=> {
    const getTasks = async () => {
      if(loggedIn ) {
        const tasks = await API.loadAllTasks();
        setTaskList(tasks);
        setLoading(false)
        setDirty(false);
      }
    };
    getTasks()
      .catch(err => {
        setMessage({msg: "Impossible to load your exams! Please, try again later...", type: 'danger'});
        console.error(err);
      });
  }, [loggedIn,dirty]);

  
  function addTask (task)  {
    setTaskList((oldTasks) => [...oldTasks,task] );
   // API.addNewTask(task).then((err)=>{setDirty(true)})
   API.addTask(task).then((err)=>{setDirty(true)})
  }

  function deleteTask (task) {
    setTaskList((oldTasks) => oldTasks.filter( t => t.id !== task.id ));
    API.deleteTask(task)
      .then(() => {
        setDirty(true);
      }).catch(err => (err) );
  
  }

  function updateTask  (task)  {
    // setTaskList( oldTasks => oldTasks.map( t => t.id === task.id ? {...task} : t) )
    setTaskList( oldTasks => oldTasks.map( t => t.id === task.id ) )
    setLoading(true)
    API.updateTask(task)
    .then(() => {
      setDirty(true);
     
    }).catch(err => (err) );
    ;
    
  }

  function updateTaskCompleted(task){
    setTaskList( oldTasks =>  oldTasks.map( t => t.id === task.id ) )
    API.updateTaskStatusCompleted(task)
    .then(()=>{
      setDirty(true);
    }).catch(err=>(err))
  }
  function findTask (id)  {
    return taskList.find( t => t.id === id);
  }

  // add or update a task into the list
  const handleSaveOrUpdate = (task) => {
    // if the task has an id it is an update
    if(task.id) {
      updateTask(task);
    }
    // otherwise it is a new task to add
    else {
      addTask(task);
    }
    setSelectedTask(MODAL.CLOSED); 
  }

  const handleEdit = (task) => {
    setSelectedTask(task.id);
  }
  
  const handleClose = () => {
    setSelectedTask(MODAL.CLOSED);
  }

  // const handleErrors = (err) => {
  //   if(err.errors)
  //     setMessage({msg: err.errors[0].msg + ': ' + err.errors[0].param, type: 'danger'});
  //   else
  //     setMessage({msg: err.error, type: 'danger'});
    
  //   setDirty(true);
  // }


  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user}!`, type: 'success'});
    } catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setTaskList([])
  }

  // we need to render the ModalForm subject to a condition, so that it is created and destroyed every time, thus useState is called again to initialize the state variables
  return (
    <Router>
     <Navigation />
      <Container fluid>
      <Row>
        <AppTitle/>
        {loggedIn ? <LogoutButton logout={doLogOut} /> : <Redirect to="/login" />}
      </Row>
      {message && <Row>
         <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row> }
        
        <Row className="vh-100">
          <Switch>
          <Route path="/login" render={() => 
          <>{loggedIn ? <Redirect to="/list/all" /> : <LoginForm login={doLogIn} />}</>
        }/>
        
        
            <Route path={["/list/:filter"]}>
              <TaskMgr taskList={taskList} onDelete={deleteTask} onEdit={handleEdit} loading={loading} onSave={updateTaskCompleted}></TaskMgr>
              <Button variant="success" size="lg" className="fixed-right-bottom" onClick={() => setSelectedTask(MODAL.ADD)}>+</Button>
              {(selectedTask !== MODAL.CLOSED) && <ModalForm task={findTask(selectedTask)} onSave={handleSaveOrUpdate} onClose={handleClose}></ModalForm>}
            </Route>
           
          
          </Switch>

        </Row>
      </Container>
    </Router>
  );

}


function TaskMgr (props) {

  const { taskList, onDelete, onEdit,loading, onSave } = props;

  // Gets active filter from route if matches, otherwise the dafault is all
  const params = useParams();
   
  // ** FILTER DEFINITIONS AND HELPER FUNCTIONS **
  const filters = {
    'all': { label: 'All', id: 'all', filterFn: () => true },
    'important': { label: 'Important', id: 'important', filterFn: t => t.important },
    'today': { label: 'Today', id: 'today', filterFn: t => t.deadline && dayjs(t.deadline).isToday() },
    'nextweek': { label: 'Next 7 Days', id: 'nextweek', filterFn: t => isNextWeek(dayjs(t.deadline)) },
    'private': { label: 'Private', id: 'private', filterFn: t => t.private },
    'public': {label: 'Public', id: 'public', filterFn: t=>!t.private}
  };

  const activeFilter = (params && params.filter && params.filter in filters) ? params.filter : 'all';

  const isNextWeek = (d) => {
    const tomorrow = dayjs().add(1, 'day');
    const nextWeek = dayjs().add(7, 'day');
    const ret = d && (!d.isBefore(tomorrow, 'day') && !d.isAfter(nextWeek, 'day'));
    return ret;
  }

  const history = useHistory();

  // Route to the filter view
  function handleSelection(filter) {
    history.push("/list/" + filter);
    if(filter === "all"){
      API.getTasks()
        .then((tasks) => this.setState({tasks: tasks, filter: 'all'}))
        .catch(err => (err) );
    } else {
      API.getTasks(filter)
        .then((tasks) => {
          this.setState({tasks: tasks, filter: filter});
        })
        .catch(err => (err) );
    }
  }



  return (
    <>
      <Col xs={4} bg="light" className="below-nav" id="left-sidebar">
          <Filters items={filters} defaultActiveKey={activeFilter} onSelection={handleSelection} />
        </Col>
      <Col xs={8} className="below-nav">
        <h1 className="pb-3">Filter: <small className="text-muted">{activeFilter}</small></h1>
        {loading ? <h3>Please wait, data is loading</h3>:
        <ContentList 
          tasks={taskList.filter(filters[activeFilter].filterFn)} 
          onDelete={onDelete} onEdit={onEdit}
          onSave={onSave}
          />
        }
      </Col>
    </>
  )

}

export default App;
