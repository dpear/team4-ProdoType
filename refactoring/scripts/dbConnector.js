export class DBConnector{
    constructor(){
        this.dbName = "pomodoro_db";
        this.dbVersion = 1;
        this.storeName = "pomodoro_store";
        this.createDB();
    }



    createDB(){
        const req = indexedDB.open(this.dbName, this.dbVersion)

        req.onupgradeneeded = e =>{
            this.dbObject = e.target.result;
            this.dbObject.createObjectStore(this.storeName, {keyPath: "title"});
            console.log(`upgrade is called and DB is created with name ${this.dbObject.name} and version ${this.dbObject.version}`);
        }

        req.onsuccess = e =>{
            this.dbObject = e.target.result;
            console.log(`onSuccess is called and already created DB is returned with name ${this.dbObject.name} and version ${this.dbObject.version}`);
        }

        req.onerror = e => {
            console.log(`onError is called for ${this.dbName} and version ${this.dbVersion}`);
        }
    }
}