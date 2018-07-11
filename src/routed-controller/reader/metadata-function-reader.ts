import { inject, injectable } from 'inversify';
import { FunctionReader, HubContainer, Types } from 'ts-hub';

@injectable()
export class MetadataFunctionReader implements FunctionReader {

    constructor(@inject(Types.Container) private hubContainer: HubContainer) {

    }

    
    public readFunctionFromNewTarget(controller: any, action: string): Function {       
        var controllerInstance = this.hubContainer.bindAndGet<any>(controller.constructor);
        return this.readFunction(controllerInstance, action);
    }

    public readFunction(controllerInstance: any, action: string): Function {       
        return (...args: any[]) => { return controllerInstance[action].apply(controllerInstance, args); };
    }
}