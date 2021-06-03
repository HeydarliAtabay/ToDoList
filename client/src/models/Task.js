import dayjs from 'dayjs';

class Task{    

    constructor(id, description, important, privateT, deadline, completed,user) {
        if(id){
            this.id = id;
        }
            
        this.description = description;
        this.important = important;
        this.privateT = privateT;

        if(deadline !== undefined){
            this.deadline = dayjs(deadline);
        }
        this.completed = completed || false;
        this.user = user;
    }

    /**
     * Construct a Task from a plain object
     * @param {{}} json 
     * @return {Task} the newly created Task object
     */
    static from(json) {
        const t =  Object.assign(new Task(), json);
        if(t.deadline){
            t.deadline = dayjs(t.deadline);
        }
        return t;
    }

}

export default Task;