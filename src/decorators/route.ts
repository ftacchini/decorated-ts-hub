import { RouteBuilder } from 'ts-hub';
import { HubContainer } from 'ts-hub';
import { MethodMetadata } from './../helper/method-metadata';
import { ControllerMetadataBuilder, ControllerMetadataKeys } from "../index";

export const Route = function attributeDefinition<T, Y extends RouteBuilder<T, any, any>>(
    constructor: new (...args: any[]) => Y,
    information?: T) {

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