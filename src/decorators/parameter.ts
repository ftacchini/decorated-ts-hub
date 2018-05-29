import { HubContainer, ParameterBuilder } from 'ts-hub';

import { ControllerMetadataKeys } from '..';
import { interfaces } from 'inversify';

export const Parameter = function attributeDefinition<Y>(
    constructor: interfaces.Newable<ParameterBuilder<Y,any>>,
    information?: Y) {

    return (target: any, propertyKey: string, arg: number) => {

        var builder = (container: HubContainer): any => {
            var instance = container.bindAndGet<ParameterBuilder<Y,any>>(constructor);
            instance.withTarget(target)
                .withInformation(information)
                .withPropertyKey(propertyKey)
                .withArgumentIndex(arg);

            return instance;
        };

        if (!Reflect.hasMetadata(ControllerMetadataKeys.PARAMETER_BUILDER, target, propertyKey)) {
            Reflect.defineMetadata(ControllerMetadataKeys.PARAMETER_BUILDER, [], target, propertyKey);
        }

        var builders = Reflect.getMetadata(ControllerMetadataKeys.PARAMETER_BUILDER, target, propertyKey);
        builders.push(builder);
    }
}