import { HubContainer, ParameterBuilder } from 'ts-hub';
import { ArgumentMetadata } from './../helper/argument-metadata';
import { ControllerMetadataBuilder, ControllerMetadataKeys } from "../index";

export const Parameter = function attributeDefinition<Y extends ParameterBuilder<any, any>>(
    constructor: new (...args: any[]) => Y,
    information?: any) {

    return (target: any, propertyKey: string, arg: number) => {

        var builder = (container: HubContainer): any => {
            var instance = container.bindAndGet<Y>(constructor);
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