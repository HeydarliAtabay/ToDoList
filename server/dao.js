'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('tasks.db', (err) => {
  if(err) throw err;
});

// get all tasks
exports.listAllTasks = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((task) => ({ id: task.id, description: task.description, important: task.important,
    private: task.private, deadline:task.deadline  }));
      resolve(courses);
    });
  });
};


// get important tasks
exports.listImportantTasks = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks Where important=1';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const courses = rows.map((task) => ({ id: task.id, description: task.description, important: task.important,
      private: task.private, deadline:task.deadline  }));
        resolve(courses);
      });
    });
  };


// get the course identified by {code}
exports.getCourse = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE code=?';
    db.get(sql, [code], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        reject({error: 'Course not found.'});
      } else {
        const course = { code: row.code, name: row.name, CFU: row.CFU };
        resolve(course);
      }
    });
  });
};

// get all exams
exports.listExams = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT coursecode, score, date FROM exam';

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const exams = rows.map((e) => (
        {
          code: e.coursecode,
          score: e.score,
          date: e.date,
        }));

      resolve(exams);
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