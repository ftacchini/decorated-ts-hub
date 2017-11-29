import { injectable, inject } from 'inversify';
import { FunctionReader, HubContainer, Types } from 'ts-hub';

@injectable()
export class MetadataFunctionReader implements FunctionReader {

    constructor(@inject(Types.Container) private hubContainer: HubContainer) {

    }

    public readFunction(controller: any, action: string): Function {       
        var controllerInstance = this.hubContainer.bindAndGet<any>(controller.constructor);
        return controllerInstance[action];
    }
}