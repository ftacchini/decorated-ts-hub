import { injectable } from 'inversify';
import { ControllerMetadataBuilder, ControllerMetadataKeys } from "../index";
import { ConstructorMiddlewareBuilder, HubContainer } from 'ts-hub';

export const InterceptorFactory = (priorityModifier: (prior: number) => number) => {

    return (constructor: new (...args: any[]) => any, information?: any, priority?: number) => {

        return (target: any, propertyKey: string) => {
            var constructorBuilders = Reflect.getMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, constructor);

            constructorBuilders && constructorBuilders.length && constructorBuilders.foreah((constructorBuilder: any) => {
                if (!Reflect.hasMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER, target, propertyKey)) {
                    Reflect.defineMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER, [], target, propertyKey);
                }

                var builder = (container: HubContainer): any => {
                    var instance = constructorBuilder(container, information, priority);
                    return instance;
                };

                var builders = Reflect.getMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, target, propertyKey);
                builders.push(builder);
            })
        }
    }
}