import { ActivationContext } from "ts-hub";

export class MetadataActivationContext implements ActivationContext {
    
    constructor(private controllerInstance: any) {
    }

    public getActivationFunction(action: string): Function {
        return (...args: any[]) => { return this.controllerInstance[action].apply(this.controllerInstance, args); };
    }
}