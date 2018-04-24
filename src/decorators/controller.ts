import { injectable } from 'inversify';
import { HubContainer, RoutedControllerBuilder } from 'ts-hub';

import { ControllerMetadataKeys } from '..';

export const Controller = function attributeDefinition<Y extends RoutedControllerBuilder<any, any, any, any>>(
    constructor: new (...args: any[]) => Y,
    information?: any) {

    return (target: any) => {
        injectable()(target);

        var builder = (container: HubContainer): any => {
            var instance = container.bindAndGet<Y>(constructor);
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