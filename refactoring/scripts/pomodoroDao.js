export class Pomodoro{
    constructor(title, time_taken, date_of_execution, tags, notes, is_completed){
        this.title=title;
        this.time_taken = time_taken;
        this.date_of_execution = date_of_execution;
        this.tags = tags;
        this.notes = notes;
        this.is_completed = is_completed;
    }

    convert_to_json(){
        return JSON.stringify(this);
    }

    convert_to_pojo(jsonString){
        return JSON.parse(jsonString);
    }
}