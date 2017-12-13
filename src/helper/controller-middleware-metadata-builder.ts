import { ControllerMetadataKeys } from './index';
import { ConstructorMiddlewareBuilder, Handler, MultiserverMiddlewareBuilder, MiddlewareSupport } from 'ts-hub';
import { ControllerMetadataBuilder } from './controller-metadata-builder';


export class ControllerMiddlewareMetadataBuilder {
    private static _instance: ControllerMiddlewareMetadataBuilder;
    public static get instance(): ControllerMiddlewareMetadataBuilder {
        return this._instance || (this._instance = new ControllerMiddlewareMetadataBuilder());
    }

    private constructor() {

    }

    public buildServerSpecificMiddleware<T>(
        middlewareBuilderConstructor: new (...args: any[]) => ConstructorMiddlewareBuilder<T, any, any>,
        middlewareConstructor: new (...args: any[]) => Handler<T>,
        priority?: number,
        metadataTags: symbol[] = [ControllerMetadataKeys.MIDDLEWARE_BUILDER]) : (information?: T) => any {

            return ControllerMetadataBuilder.instance.buildMethodLevelMetadata(
                middlewareBuilderConstructor, 
                metadataTags, 
                (instance: ConstructorMiddlewareBuilder<T, any, any>) => {
                    instance
                        .withMiddlewareConstructor(middlewareConstructor)
                        .withPriority(priority || 1)
                });
    }

    public buildMultiserverMiddleware<T>(
        middlewareSupport: MiddlewareSupport<T>[],
        middlewareConstructor: new (...args: any[]) => Handler<T>,
        priority?: number,
        metadataTags: symbol[] = [ControllerMetadataKeys.MIDDLEWARE_BUILDER]) : (information?: T) => any {

            return ControllerMetadataBuilder.instance.buildMethodLevelMetadata(
                MultiserverMiddlewareBuilder, 
                metadataTags, 
                (instance: MultiserverMiddlewareBuilder<T>) => {
                    instance.withMiddlewareSupport(middlewareSupport)
                            .withMiddlewareConstructor(middlewareConstructor)
                            .withPriority(priority || 1);
                });
        }
}