import dayjs from 'dayjs'

import Task from './models/Task'

const url='http://localhost:3000'


// API for loading all tasks
async function  loadAllTasks(){
 const response= await fetch(url+'/api/tasks')
 const tasks= await response.json()
 return tasks

 //Error handling is missing
}



async function getTasks(filter) {
  let url1 = "/api/tasks";
  if(filter){
      const queryParams = "/filter/" + filter;
      url1 += queryParams;
  }
  const response = await fetch(url + url1);
  const tasksJson = await response.json();
  if(response.ok){
      //return tasksJson.map((t) => Task.from(t));
      return tasksJson.map((t) => new Task(t.id,t.description,t.important, t.privateTask,t.deadline, t.completed,t.user));
  } else {
      let err = {status: response.status, errObj:tasksJson};
      throw err;  // An object with the error coming from the server
  }
}


/**
 * Send a POST /api/tasks
 * returns an error object if something is wrong
 * return null if everything is ok
 * @param {*} task 
 */

function addTask(task) {
    // call: POST /api/exams
    return new Promise((resolve, reject) => {
      fetch(url + '/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({code: exam.coursecode, score: exam.score, date: exam.date}),
        body : JSON.stringify({description: task.description, important: task.important, private: task.private, deadline: dayjs(task.deadline), completed: task.completed, user: task.user})
        }).then((response) => {
          if (response.ok) {
            resolve(null);
          } else {
            // analyze the cause of error
            response.json()
              .then((message) => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

  function deleteTask(task) {
    // call: DELETE /api/exams/:coursecode
    return new Promise((resolve, reject) => {
      fetch(url + '/api/tasks/delete/' + task.id, {
        method: 'DELETE',
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

  function updateTask(task) {
    // call: PUT /api/exams/:coursecode
    return new Promise((resolve, reject) => {
      fetch(url + '/api/tasks/update/' + task.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({description: task.description, important: task.important, private: task.private, deadline: dayjs(task.deadline), completed: task.completed, user: task.id}),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

  function updateTaskStatusCompleted(task) {
    // call: PUT /api/exams/:coursecode
    return new Promise((resolve, reject) => {
      fetch(url + '/api/tasks/update/completed/' + task.id, {
        method: 'PUT',
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

  function updateTaskStatusUncompleted(task) {
    // call: PUT /api/exams/:coursecode
    return new Promise((resolve, reject) => {
      fetch(url + '/api/tasks/update/uncompleted/' + task.id, {
        method: 'PUT',
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }


  // User APIs
  // Login

  async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
  // logout
  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  

  // getting user info 
  async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }


  
const API={loadAllTasks,addTask,deleteTask, updateTask, updateTaskStatusCompleted,updateTaskStatusUncompleted, getTasks, logIn, logOut, getUserInfo}
export default API