import {buttonOption} from "../buttonOption";

class Elevator {
    constructor(maxCapacity) {
        this.maxCapacity = maxCapacity;
        this.weight = 0;
        this.currentLoad = 0;
    }
    handlebuttonListerner(buttonListerner) {
        if (this.currentLoad > this.maxCapacity) {
            console.log('The elevator reaches the maximum capacity now');
            // If the elevator is reaching the total weight limit
        }
        else if (buttonListerner.type == buttonType.inside) {
            const maxWeightBreach = weightCheck()
            if (!maxWeightBreach) {
                if (buttonListerner.choice == buttonOption.upward) {
                    takeUpwardAction() 
                } else if (buttonListerner.choice == buttonOption.downward) {
                    takeDownwardAction() 
                } else if (buttonListerner.choice == buttonOption.alarm) {
                    takeAlarmAction()
                } 
            }
        }
    }
}
