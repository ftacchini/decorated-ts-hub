import { AbstractMiddlewareBuilder } from 'ts-hub';

import { ControllerMetadataKeys } from '.';
import { ControllerMetadataBuilder } from './controller-metadata-builder';


export class ControllerMiddlewareMetadataBuilder {
    private static _instance: ControllerMiddlewareMetadataBuilder;
    public static get instance(): ControllerMiddlewareMetadataBuilder {
        return this._instance || (this._instance = new ControllerMiddlewareMetadataBuilder());
    }

    private constructor() {

    }

    public buildServerSpecificMiddleware<T>(
        middlewareBuilderConstructor: new (...args: any[]) => AbstractMiddlewareBuilder<T, any, any>,
        middlewareConstructor: new (...args: any[]) => any,
        metadataTags: symbol[] = [ControllerMetadataKeys.MIDDLEWARE_BUILDER]) : (information?: T) => any {

            return ControllerMetadataBuilder.instance.buildMethodLevelMetadata(
                middlewareBuilderConstructor, 
                metadataTags, 
                (instance: AbstractMiddlewareBuilder<T, any, any>) => {
                    instance
                        .withTarget(middlewareConstructor);
                });
    }
}