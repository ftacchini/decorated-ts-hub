import { ExecutionOrder, HubContainer } from 'ts-hub';

import { ControllerMetadataKeys } from '..';

export const InterceptorFactory = (executionOrder: ExecutionOrder) => {

    return (constructor: new (...args: any[]) => any, information?: any) => {

        return (target: any, propertyKey?: string) => {
            var constructorBuilders = Reflect.getMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, constructor);

            constructorBuilders && constructorBuilders.length && constructorBuilders.forEach((constructorBuilder: any) => {
                if (!Reflect.hasMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER, target, propertyKey)) {
                    Reflect.defineMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER, [], target, propertyKey);
                }

                var builder = (container: HubContainer): any => {
                    var instance = constructorBuilder(container, information, executionOrder);
                    return instance;
                };

                var builders = Reflect.getMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER, target, propertyKey);
                builders.push(builder);
            })
        }
    }
}