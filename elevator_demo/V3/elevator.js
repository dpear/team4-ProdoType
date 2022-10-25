import {UpwardActionHandler} from "ActionHandlers/UpwardActionHandler";
import {DownwardActionHandler} from "ActionHandlers/DownwardActionHandler";
import {StopctionHandler} from "ActionHandlers/StopctionHandler";
import {SafetyChecksModule} from "SafetyChecksModule";

class Elevator {
    constructor(safetyChecksModule,
                elevatorActionAdapter) {
        this.safetyChecksModule = safetyChecksModule;
        this.elevatorActionAdapter = elevatorActionAdapter;
        //...
    }

    handlebuttonListerner(buttonListerner) {
        this.safetyChecksModule.checkElevatorLoad(this.currentLoad);
        const actionHandler = this.elevatorActionAdapter.getActionHandler(buttonListerner.type)
        actionHandler.doSomething();
    }
}
