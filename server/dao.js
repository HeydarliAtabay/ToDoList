'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');



// open the database
const db = new sqlite.Database('tasks.db', (err) => {
  if(err) throw err;
});

 const getTodayDate = (date) => {
  return dayjs().isSame(date, 'day')
 
 }

 const todaydatetime= (date)=>{
   const today = dayjs().add(0,'day')
   const tomorrow = dayjs().add(1,'day')

   return date.isAfter(today) && date.isBefore(tomorrow)
 }

 //const todaysdate= dayjs().format('YYYY-MM-DD HH : mm')
 const getNextWeek = (date) => {
  const nextW=dayjs().add(7, 'day')
  const nextD=dayjs().add(1,'day')
  return date.isAfter(nextD) && date.isBefore(nextW)
}

//get all tasks
exports.listAllTasks = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tasks = rows.map((task) => ({ id: task.id, description: task.description, important: task.important,
    private: task.private, deadline:task.deadline  }));
      resolve(tasks);
    });
  });
};

//get tasks with specific filter

exports.getWithFilter = function(filter) {
  return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM tasks";
      db.all(sql, [], (err, rows) => {
          if (err) {
              reject(err);
          } else {
              let tasks =  rows.map((task) => ({ id: task.id, description: task.description, important: task.important,
                private: task.private, deadline:task.deadline  }));
              if(filter){
                  switch(filter){
                      case "important":
                          tasks = tasks.filter((el) => {
                              return el.important;
                          });
                          break;
                      case "private":
                          tasks = tasks.filter((el) => {
                              return el.private;
                          });
                          break;
                      case "public":
                          tasks = tasks.filter((el) => {
                              return !el.private;
                          });
                          break;
                      case "today":
                          tasks = tasks.filter((el) => {
                              if(el.deadline)
                                  return todaydatetime(dayjs(el.deadline));
                              else
                                  return false;
                          });
                          break;
                      case "week":
                          tasks = tasks.filter((el) => {
                              if(el.deadline)
                                  return getNextWeek(dayjs(el.deadline));
                              else
                                  return false;
                          });
                          break;
                     
                  }
              }
              resolve(tasks);
          }
      });
  });
}
//get tasks with given id
exports.getTask = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks WHERE id=?';
    db.get(sql, [code], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        reject({error: 'Course not found.'});
      } else {
        const course = {  id: row.id, description: row.description, important: row.important,
          private: row.private, deadline: row.deadline };
        resolve(course);
      }
    });
  });
};

//adding new Task to the DB
exports.createTask=(task)=>{
  if(task.deadline){
    task.deadline = dayjs(task.deadline);
}
  return new Promise((resolve, reject)=>{
    const sql = 'INSERT INTO tasks(description, important, private, deadline, completed,user) VALUES(?,?,?,?,?,?)'
    //const sql= 'INSERT INTO tasks(description,user) VALUES(?,?))';

    db.run(sql, [task.description, task.important, task.private, task.deadline.format('YYYY-MM-DD HH:mm'), task.completed, task.user], function(err){
      if(err){
        reject(err);
        return;
      }
      resolve(this.lastID)
    });
  });
};


//Update an existing task with a given id

exports.updateTask = function(id, task) {
  if(task.deadline)
      task.deadline = dayjs(task.deadline);
  return new Promise((resolve, reject) => {
      const sql = 'UPDATE tasks SET description = ?, important = ?, private = ?, deadline = ?, completed = ?,user=? WHERE id = ?';
      db.run(sql, [task.description, task.important, task.private, task.deadline.format("YYYY-MM-DD HH:mm"), task.completed, task.user, id], (err) => {
          if(err){
              console.log(err);
              reject(err);
          }
          else
              resolve(null);
      })
  });
}

// Update the status of an existing task to completed
exports.updateTaskStatusCompleted = function(id) {
  return new Promise((resolve, reject) => {
     // const sql = 'UPDATE tasks SET completed = CASE status WHEN completed=0 THEN 1 WHEN completed=1 THEN 0 END WHERE id = ?';
     const sql= 'UPDATE tasks SET completed=1 WHERE id=?'
      db.run(sql, [id], (err) => {
          if(err){
              console.log(err);
              reject(err);
          }
          else
              resolve(null);
      })
  });
}

// Update the status of an existing task to uncompleted
exports.updateTaskStatusUncompleted = function(id) {
  return new Promise((resolve, reject) => {
     // const sql = 'UPDATE tasks SET completed = CASE status WHEN completed=0 THEN 1 WHEN completed=1 THEN 0 END WHERE id = ?';
     const sql= 'UPDATE tasks SET completed=0 WHERE id=?'
      db.run(sql, [id], (err) => {
          if(err){
              console.log(err);
              reject(err);
          }
          else
              resolve(null);
      })
  });
}

// DELETE existing task with a given id
exports.deleteTask = function(id) {
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tasks WHERE id = ?';
      db.run(sql, [id], (err) => {
          if(err)
              reject(err);
          else 
              resolve(null);
      })
  });
}
//******************PROF'S EXAMPLE***********************
// update an existing exam  
// exports.updateExam = (exam) => {
//   return new Promise((resolve, reject) => {
//     const sql = 'UPDATE exam SET date=DATE(?), score=? WHERE coursecode = ?';
//     db.run(sql, [exam.date, exam.score, exam.code], function (err) {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(this.lastID);
//     });
//   });
// };


//******************PROF'S EXAMPLE***********************
// delete an existing exam
exports.deleteExam = (course_code) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM exam WHERE coursecode = ?';
    db.run(sql, [course_code], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

