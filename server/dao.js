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
   const today = dayjs().isSame(date,'day')
   const tomorrow = dayjs().add(2,'day')

   return date.isAfter(today) && date.isBefore(tomorrow)
 }

 const todaysdate= dayjs().format('YYYY-MM-DD HH : mm')
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
                                  return todaydatetime(el.deadline);
                              else
                                  return false;
                          });
                          break;
                      case "week":
                          tasks = tasks.filter((el) => {
                              if(el.deadline)
                                  return getNextWeek(el.deadline);
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
      console.log(this.lastID);
      resolve(this.lastID)
    });
  });
};

// add a new exam
exports.createExam = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO exam(coursecode, date, score) VALUES(?, DATE(?), ?)';
    db.run(sql, [exam.code, exam.date, exam.score], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// update an existing exam
exports.updateExam = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE exam SET date=DATE(?), score=? WHERE coursecode = ?';
    db.run(sql, [exam.date, exam.score, exam.code], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

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

