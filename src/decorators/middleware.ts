import { injectable, interfaces } from 'inversify';
import * as _ from 'lodash';
import { ExecutionOrder, HubContainer, MiddlewareBuilder, MiddlewareInformation } from 'ts-hub';

import { ControllerMetadataKeys } from '..';



export const Middleware = function attributeDefinition<Y extends MiddlewareInformation>(
    constructor: interfaces.Newable<MiddlewareBuilder<Y,any,any>>,
    handlerMethod: string = "handler",
    informationDefaults?: Y) {

    return (target: any) => {
        injectable()(target);

        var builder = (container: HubContainer, information: any = {}, executionOrder: ExecutionOrder = ExecutionOrder.Activation): any => {
            var instance = container.bindAndGet<MiddlewareBuilder<Y,any,any>>(constructor);
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