import { HubContainer, RouteBuilder } from 'ts-hub';

import { ControllerMetadataKeys } from '..';

export const Route = function attributeDefinition<Y extends RouteBuilder<any, any, any>>(
    constructor: new (...args: any[]) => Y,
    information?: any) {

    return (target: any, propertyKey: string) => {

        var builder = (container: HubContainer): any => {
            var instance = container.bindAndGet<Y>(constructor);
            instance.withTarget(target)
                .withInformation(information)
                .withPropertyKey(propertyKey);

            return instance;
        };


        if (!Reflect.hasMetadata(ControllerMetadataKeys.ROUTE_BUILDER, target, propertyKey)) {
            Reflect.defineMetadata(ControllerMetadataKeys.ROUTE_BUILDER, [], target, propertyKey);
        }

        var builders = Reflect.getMetadata(ControllerMetadataKeys.ROUTE_BUILDER, target, propertyKey);
        builders.push(builder);
    }
}