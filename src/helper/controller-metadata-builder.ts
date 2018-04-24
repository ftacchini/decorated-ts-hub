import { HubContainer } from 'ts-hub';

import { ArgumentMetadata } from './argument-metadata';
import { ClassMetadata } from './class-metadata';
import { MethodMetadata } from './method-metadata';

export class ControllerMetadataBuilder {

    private static _instance: ControllerMetadataBuilder;
    public static get instance(): ControllerMetadataBuilder {
        return this._instance || (this._instance = new ControllerMetadataBuilder());
    }

    private constructor() {

    }

    public buildControllerLevelMetadata<T, Y extends ClassMetadata<T>>(
        constructor: new (...args: any[]) =>Y,
        metadataTags: symbol[]) : (information?: T) => any {

        return function attributeDefinition(information?: T) {

            return function (target: any) {
                var controllerBuilder = (container: HubContainer): any => { 
                    var instance =  container.bindAndGet<Y>(constructor); 
                    instance.withTarget(target)
                            .withInformation(information);
                    
                    return instance;
                };

                metadataTags && metadataTags.forEach((metadata) => {
                    if(!Reflect.hasMetadata(metadata, target)) {
                        Reflect.defineMetadata(metadata, [], target);
                    }
                    
                    var builders = Reflect.getMetadata(metadata, target);
                    builders.push(controllerBuilder);
                });
            }
        }
    }

    public buildMethodLevelMetadata<T, Y extends MethodMetadata<T>>(
        constructor: new (...args: any[]) => Y,
        metadataTags: symbol[], 
        extraSetters: (instance: Y) => void = null) : (information?: T) => any {

        return function attributeDefinition(information?: T) {

            return function (target: any, propertyKey: string) {
                var controllerBuilder = (container: HubContainer): any => { 
                    var instance =  container.bindAndGet<Y>(constructor); 
                    instance.withTarget(target)
                            .withInformation(information)
                            .withPropertyKey(propertyKey);

                    extraSetters && extraSetters(instance);

                    return instance;
                };

                metadataTags && metadataTags.forEach((metadata) => {
                    
                    if(!Reflect.hasMetadata(metadata, target, propertyKey)) {
                        Reflect.defineMetadata(metadata, [], target, propertyKey);
                    }
                    
                    var builders = Reflect.getMetadata(metadata, target, propertyKey);
                    builders.push(controllerBuilder);
                });
            }
        }
    }

    public buildArgumentLevelMetadata<T, Y extends ArgumentMetadata<T>>(
        constructor: new (...args: any[]) => Y,
        metadataTags: symbol[]) : (information?: T) => any {

        return function attributeDefinition(information?: T) {

            return function (target: any, propertyKey: string, arg: number) {
                var controllerBuilder = (container: HubContainer): any => { 
                    var instance =  container.bindAndGet<Y>(constructor); 
                    instance.withTarget(target)
                            .withInformation(information)
                            .withPropertyKey(propertyKey)
                            .withArgumentIndex(arg);

                    return instance;
                };

                metadataTags && metadataTags.forEach((metadata) => {
                    if(!Reflect.hasMetadata(metadata, target, propertyKey)) {
                        Reflect.defineMetadata(metadata, [], target, propertyKey);
                    }
                    
                    var builders = Reflect.getMetadata(metadata, target, propertyKey);
                    builders.push(controllerBuilder);
                });
            }
        }
    }
}