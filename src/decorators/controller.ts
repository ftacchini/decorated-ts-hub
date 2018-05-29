import { injectable, interfaces } from 'inversify';
import { HubContainer, RoutedControllerBuilder } from 'ts-hub';

import { ControllerMetadataKeys } from '..';

export const Controller = function attributeDefinition<Y>(
    constructor: interfaces.Newable<RoutedControllerBuilder<Y, any, any, any>>,
    information?: Y) {

    return (target: any) => {
        injectable()(target);

        var builder = (container: HubContainer): any => {
            var instance = container.bindAndGet<RoutedControllerBuilder<Y, any, any, any>>(constructor);
            instance.withTarget(target)
                .withInformation(information);

            return instance;
        };


        if (!Reflect.hasMetadata(ControllerMetadataKeys.CONTROLLER_BUILDER, target)) {
            Reflect.defineMetadata(ControllerMetadataKeys.CONTROLLER_BUILDER, [], target);
        }

        var builders = Reflect.getMetadata(ControllerMetadataKeys.CONTROLLER_BUILDER, target);
        builders.push(builder);
    }
}