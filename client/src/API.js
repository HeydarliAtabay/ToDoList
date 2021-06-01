const url='http://localhost:3000'

async function  loadAllTasks(){
 const response= await fetch(url+'/api/tasks')
 const tasks= await response.json()
 return tasks

 //Error handling is missing
}

export{loadAllTasks}