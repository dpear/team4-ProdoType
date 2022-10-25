export class SafetyChecksModule{
    constructor(maxCapacity) {
        this.maxCapacity = maxCapacity;
        this.weight = 0;
        this.currentLoad = 0;
    }
    checkElevatorLoad(currentLoad){
        //implement load safety checks
    }
}
