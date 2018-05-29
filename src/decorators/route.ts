import { HubContainer, RouteBuilder } from 'ts-hub';

import { ControllerMetadataKeys } from '..';
import { interfaces } from 'inversify';

export const Route = function attributeDefinition<Y>(
    constructor: interfaces.Newable<RouteBuilder<Y, any, any>>,
    information?: Y) {

    return (target: any, propertyKey: string) => {

        var builder = (container: HubContainer): any => {
            var instance = container.bindAndGet<RouteBuilder<Y, any, any>>(constructor);
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