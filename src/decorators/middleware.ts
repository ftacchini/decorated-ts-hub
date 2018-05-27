import { injectable } from 'inversify';
import * as _ from 'lodash';
import { AbstractMiddlewareBuilder, ExecutionOrder, HubContainer } from 'ts-hub';

import { ControllerMetadataKeys } from '..';

export const Middleware = function attributeDefinition<Y extends AbstractMiddlewareBuilder<any, any, any>>(
    constructor: new (...args: any[]) => Y,
    handlerMethod: string = "handler",
    informationDefaults?: any) {

    return (target: any) => {
        injectable()(target);

        var builder = (container: HubContainer, information: any = {}, executionOrder: ExecutionOrder = ExecutionOrder.Activation): any => {
            var instance = container.bindAndGet<Y>(constructor);
            information.executionOrder = executionOrder;

            instance.withTarget(target)
                .withPropertyKey(handlerMethod)
                .withInformation(_.extendWith(information, informationDefaults));

            return instance;
        };


        if (!Reflect.hasMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, target)) {
            Reflect.defineMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, [], target);
        }

        var builders = Reflect.getMetadata(ControllerMetadataKeys.MIDDLEWARE_BUILDER_CONSTRUCTOR, target);
        builders.push(builder);
    }
}