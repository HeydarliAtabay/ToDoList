# BigLab 2 - Class: 2021 WA1

## Team name: THE DEBUGGERS

Team members:

- s277000 HEYDARLI ATABAY
- s275373 TUZER BADE SU
- s290292 SOUFIANE AKSADI

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

### Getting all Tasks

- [GET http://localhost:3001/api/tasks]
- [This API is just taking all tasks from the DB]
- [{ id: task.id, description: task.description, important: task.important, private: task.private, deadline:task.deadline }]
- [Error responses, if any]

### Getting all Tasks

- [HTTP Method] [URL, with any parameter]
- [One-line about what this API is doing]
- [Sample request, with body (if any)]
- [Sample response, with body (if any)]
- [Error responses, if any]

### Getting filtered tasks

- [GET http://localhost:3001/api/tasks/filter/:filter]
- [By writing the filter name to the :filter, this API is getting all tasks with given filter]
- [Sample response, with body (if any)]
- [Error responses, if any]

### Getting Task with selected id

- [GET http://localhost:3001/api/tasks/:taskID]
- [This API is taking a task with a given ID]
- [GET http://localhost:3001/api/tasks/5]
- [Sample response, with body (if any)]
- [Error responses, if any]

### Creating a new task to the server

- [POST http://localhost:3001/api/tasks]
- [Inserting a task, getting info from the request body of the API]
- [{ "description": "Test 2", "important": 1,"private": 1, "deadline":"2021-05-25 15:00" , "completed":0, "user":1 }]
- [Sample response, with body (if any)]
- [Error responses, if any]

### Updating a task with given ID

- [PUT http://localhost:3001/api/tasks/update/:taskID]
- [Updating selected task with a given ID, info to be updated is taken from the request body]
- [PUT http://localhost:3001/api/tasks/update/12
  { "description": "Make a reservation for the study room 2R", "important": 0,"private": 0, "deadline":"2021-05-19 16:00" , "completed":1, "user":1 }
  ]
- [Sample response, with body (if any)]
- [Error responses, if any]

### Updating task's status to completed

- [PUT http://localhost:3001/api/tasks/update/completed/:taskID]
- [Changing the status of the task from uncompleted to completed]
- [PUT http://localhost:3001/api/tasks/update/completed/9]
- [Sample response, with body (if any)]
- [Error responses, if any]

### Updating task's status to uncompleted

- [PUT http://localhost:3001/api/tasks/update/uncompleted/:taskID]
- [Changing the status of the task from completed to uncompleted]
- [PUT http://localhost:3001/api/tasks/update/completed/8]
- [Sample response, with body (if any)]
- [Error responses, if any]

### Deleting selected task

- [DELETE http://localhost:3001/api/tasks/delete/:taskID]
- [Deleting the task with given ID, which is taken from the API request]
- DELETE http://localhost:3001/api/tasks/delete/15]
- [Sample response, with body (if any)]
- [Error responses, if any]
