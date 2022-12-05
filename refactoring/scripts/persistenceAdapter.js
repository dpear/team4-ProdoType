import {DBConnector} from "./dbConnector.js";

export class PersistenceAdpater{
    constructor(){
        this.db = new DBConnector();
    }

    getAllPomodoros(){
        const txnAccess = this.getReadAccess();
        const getAllReq = txnAccess.getAll();

        getAllReq.onsuccess = (ev) => {
            let req = ev.target;
            console.log('successfully retrieved all pomodoros from store');
            return req.result;
        };
        getAllReq.onerror = (err) =>{
            console.log('error in request to retriev');
        };
    }

    getAllCompletedPomodoros(){
        const txnAccess = this.getReadAccess();
        const completePomoReq = txnAccess.getAll();

        completePomoReq.onsuccess = (ev) => {
            let req = ev.target;
            console.log('successfully retrieved all completed pomodoros from store');
            return req.result.filter(p => p.is_completed === true);
        };
        completePomoReq.onerror = (err) =>{
            console.log('error in request to retriev');
        };

        return allPomodoros.filter(pomodoro => pomodoro.is_completed == true);
    }

    getAllUpcomingPomodoros(){
        const txnAccess = this.getReadAccess();
        const upcomingPomoReq = txnAccess.getAll();

        upcomingPomoReq.onsuccess = (ev) => {
            let req = ev.target;
            console.log('successfully retrieved all upcoming pomodoros from store');
            return req.result.filter(p => p.is_completed === false);
        };
        upcomingPomoReq.onerror = (err) =>{
            console.log('error in request to retriev');
        };
    }

    deletePomodoro(title){
        const txnAccess = this.getReadWriteAccess();
        const deleteReq = txnAccess.delete(title);

        deleteReq.onsuccess = (ev) => {
            console.log('successfully deleted a pomodoro to store');
        };
        deleteReq.onerror = (err) =>{
            console.log('error in request to delete');
        };
    }

    addPomodoro(pomodoro){
        const txnAccess = this.getReadWriteAccess();
        let request = txnAccess.add(pomodoro);

        request.onsuccess = (ev) => {
            console.log('successfully added a pomodoro to store');
        };
        request.onerror = (err) =>{
            console.log('error in request to add');
        };
    }

    updatePomodoro(pomodoro){
        const txnAccess = this.getReadWriteAccess();
        const updateReq = txnAccess.put(pomodoro);

        updateReq.onsuccess = (ev) => {
            console.log('successfully updated a pomodoro to store');
        };
        updateReq.onerror = (err) =>{
            console.log('error in request to update');
        };
    }

    getReadWriteAccess(){
        const txn = this.db.dbObject.transaction(this.db.storeName, "readwrite");
        return txn.objectStore(this.db.storeName);
    }

    getReadAccess(){
        const txn = this.db.dbObject.transaction(this.db.storeName, "readonly");
        return txn.objectStore(this.db.storeName);
    }


}