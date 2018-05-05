import { injectable } from 'inversify';
import * as _ from 'lodash';
import { ConstructorMiddlewareBuilder, HubContainer, ExecutionOrder } from 'ts-hub';

import { ControllerMetadataKeys } from '..';

export const Middleware = function attributeDefinition<Y extends ConstructorMiddlewareBuilder<any, any, any>>(
    constructor: new (...args: any[]) => Y,
    handlerMethod: string = "handler",
    informationDefaults?: any,
    priority?: number) {

    return (target: any) => {
        injectable()(target);

        var builder = (container: HubContainer, information: any = {}, defaultPriority?: number, executionOrder?: ExecutionOrder): any => {
            var instance = container.bindAndGet<Y>(constructor);
            instance.withTarget(target)
                .withPropertyKey(handlerMethod)
                .withPriority(defaultPriority || priority)
                .withExecutionOrder(executionOrder)
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