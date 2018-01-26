import { injectable } from 'inversify';
import { ControllerMetadataBuilder, ControllerMetadataKeys } from "../index";
import { ConstructorMiddlewareBuilder, HubContainer } from 'ts-hub';
import * as _ from "lodash";

export const Middleware = function attributeDefinition<T, Y extends ConstructorMiddlewareBuilder<T, any, any>>(
    constructor: new (...args: any[]) => Y,
    handlerMethod: string = "handler",
    informationDefaults?: T,
    priority?: number) {

    return (target: any) => {
        injectable()(target);

        var builder = (container: HubContainer, information: T = <T>{}, defaultPriority?: number): any => {
            var instance = container.bindAndGet<Y>(constructor);
            instance.withTarget(target)
                .withPropertyKey(handlerMethod)
                .withPriority(defaultPriority || priority)
                .withInformation(_.extendWith(information,  informationDefaults));

            return instance;
        };


        if (!Reflect.hasMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, target)) {
            Reflect.defineMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, [], target);
        }

        var builders = Reflect.getMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, target);
        builders.push(builder);
    }
}