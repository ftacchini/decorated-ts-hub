import { inject, injectable } from 'inversify';
import { ActivationContextProvider, HubContainer, Types, ActivationContext } from 'ts-hub';
import { MetadataActivationContext } from './metadata-activation-context';

@injectable()
export class MetadataActivationContextProvider implements ActivationContextProvider {

    constructor(@inject(Types.Container) private hubContainer: HubContainer) {

    }

    public getActivationContext(controller: any): ActivationContext {
        var controllerInstance = this.hubContainer.bindAndGet<any>(controller.constructor);
        return new MetadataActivationContext(controllerInstance);
    }
}