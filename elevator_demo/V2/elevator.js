import { buttonOption } from "../buttonOption";
import { SafetyChecksModule } from "SafetyChecksModule";
import { UpwardButtonHandler } from "UpwardButtonHandler";
import { DownwardButtonHandler } from "DownwardButtonHandler";

class Elevator {
    constructor(safetyChecksModule,
                upwardButtonHandler,
                downwardButtonHandler) {
        this.safetyChecksModule = safetyChecksModule;
        this.upwardButtonHandler = upwardButtonHandler;
        this.downwardButtonHandler = downwardButtonHandler;
        //...
    }

    handlebuttonListerner(buttonListerner) {
        this.safetyChecksModule.checkElevatorLoad(this.currentLoad);
        switch(buttonListerner.type) {
            case buttonOption.upward:
                const upwardButtonHandlerObj = this.upwardButtonHandler(buttonListerner.data);
                upwardButtonHandlerObj.takeAction();
            case buttonOption.downward:
                const downwardButtonHandlerObj = this.downwardButtonHandler(buttonListerner.data);
                downwardButtonHandlerObj.takeAction();
            // more cases follow
            default:
                logger.log(" Invalid buttonListerner type ");
        }
    }
}
