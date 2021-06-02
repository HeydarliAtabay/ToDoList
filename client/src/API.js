import dayjs from 'dayjs'

const url='http://localhost:3000'


// API for loading all tasks
async function  loadAllTasks(){
 const response= await fetch(url+'/api/tasks')
 const tasks= await response.json()
 return tasks

 //Error handling is missing
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
        body : JSON.stringify({description: task.description, important: task.important, private: task.private, deadline: dayjs(task.deadline), completed: 0, user:1})
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
          body: JSON.stringify({description: task.description, important: task.important, private: task.private, deadline: dayjs(task.deadline), completed: task.completed, user:1}),
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
  
const API={loadAllTasks,addTask,deleteTask, updateTask}
export default API