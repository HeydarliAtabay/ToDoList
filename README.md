# To Do list web application

## Developer: Heydarli Atabay


## List of APIs offered by the server

### Getting all Tasks

- [GET http://localhost:3001/api/tasks]
- [This API is just taking all tasks from the DB]
- [{ id: task.id, description: task.description, important: task.important, private: task.private, deadline:task.deadline }]
- [error response: "Getting Tasks from server was unsuccesful " + error object]

### Getting filtered tasks

- [GET http://localhost:3001/api/tasks/filter/:filter]
- [By writing the filter name to the :filter, this API is getting all tasks with given filter]
- [
  - For getting important tasks: GET http://localhost:3001/api/tasks/filter/important
  - For getting private tasks: GET http://localhost:3001/api/tasks/filter/private
  - For getting public tasks: GET http://localhost:3001/api/tasks/filter/public
  - For getting tasks for today: GET http://localhost:3001/api/tasks/filter/today
  - For getting tasks for the week: GET http://localhost:3001/api/tasks/filter/week
    ]
- [{[id: task.id, description: task.description, important: task.important,
  private: task.private, deadline:task.deadline]} WITH SELECTED FILTER]
- [Error response: "There was error while getting tasks with selected filter: {FILTERNAME}" + error object]

### Getting Task with selected id

- [GET http://localhost:3001/api/tasks/:taskID]
- [This API is taking a task with a given ID]
- [GET http://localhost:3001/api/tasks/5]
- [{id: task.id, description: task.description, important: task.important,
  private: task.private, deadline:task.deadline} WHERE ID=GIVEN taskID]
- [Error response: "Cannot get a task with selected id: {taskID}" + error object]

### Creating a new task to the server

- [POST http://localhost:3001/api/tasks]
- [Inserting a task, getting info from the request body of the API]
- [{ "description": "Test 2", "important": 1,"private": 1, "deadline":"2021-05-25 15:00" , "completed":0, "user":1 }]
- ["New task with id:{taskID for new task} was added to the DB"]
- [Error response: "Adding a new task was unsuccessful" + error object]

### Updating a task with given ID

- [PUT http://localhost:3001/api/tasks/update/:taskID]
- [Updating selected task with a given ID, info to be updated is taken from the request body]
- [PUT http://localhost:3001/api/tasks/update/12
  { "description": "Make a reservation for the study room 2R", "important": 0,"private": 0, "deadline":"2021-05-19 16:00" , "completed":1, "user":1 }
  ]
- ["Task with id:{taskId} was updated succesfully"]
- [Error response: " There was error while updating the task with id:{taskId}"+ error object]

### Updating task's status to completed

- [PUT http://localhost:3001/api/tasks/update/completed/:taskID]
- [Changing the status of the task from uncompleted to completed]
- [PUT http://localhost:3001/api/tasks/update/completed/9]
- ["Status of task with id: {taskID} was changed to Completed"]
- [Error response:"Error while updating the status of the task with id:{taskID}" + error object]

### Updating task's status to uncompleted

- [PUT http://localhost:3001/api/tasks/update/uncompleted/:taskID]
- [Changing the status of the task from completed to uncompleted]
- [PUT http://localhost:3001/api/tasks/update/completed/8]
- ["Status of task with id: {taskID} was changed to Uncompleted"]
- ["Error while updating the status of the task with id:{taskID}" + error object]

### Deleting selected task

- [DELETE http://localhost:3001/api/tasks/delete/:taskID]
- [Deleting the task with given ID, which is taken from the API request]
- DELETE http://localhost:3001/api/tasks/delete/15]
- [Selected task with id:{taskId} was deleted]
- [Error response: " Error while deleting the task with id:{taskId} " + error object]

# Test Users

| Email address    | Password |
| :--------------- | :------: |
| atabay@polito.it | atabay11 |
| bade@polito.it   | password |
| soufi@polito.it  | soufi11  |
