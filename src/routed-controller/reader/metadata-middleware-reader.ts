import { inject, injectable } from 'inversify';
import { HubContainer, MiddlewareBuilder, MiddlewareReader, Types } from 'ts-hub';

import { ControllerMetadataReader } from '../../helper';
import { ControllerMetadataKeys } from './../../helper';

@injectable()
export class MetadataMiddlewareReader implements MiddlewareReader {

    private metadataTags: symbol[];

    constructor(@inject(Types.Container) private container: HubContainer) {
        this.metadataTags = [ControllerMetadataKeys.MIDDLEWARE_BUILDER];
    }

    readControllerMiddleware<GenericRouter, RequestHandler>(router: GenericRouter, target: Object): MiddlewareBuilder<any, GenericRouter, RequestHandler>[] {
        return this.filterMiddleware(router, ControllerMetadataReader
            .instance
            .readControllerLevelMetadata<(container: HubContainer) => MiddlewareBuilder<any, GenericRouter, RequestHandler>>(this.metadataTags, target));
    }

    readRouteMiddleware<GenericRouter, RequestHandler>(router: GenericRouter, target: Object, property: string): MiddlewareBuilder<any, GenericRouter, RequestHandler>[] {
        return this.filterMiddleware(router, ControllerMetadataReader
            .instance
            .readMethodLevelMetadata<(container: HubContainer) => MiddlewareBuilder<any, GenericRouter, RequestHandler>>(this.metadataTags, target, property));
    }

    filterMiddleware<GenericRouter, RequestHandler>(router: GenericRouter, middlewareBuilders: ((container: HubContainer) => MiddlewareBuilder<any, GenericRouter, RequestHandler>)[]): MiddlewareBuilder<any, GenericRouter, RequestHandler>[] {
        return middlewareBuilders
            .filter(middlewareBuilder => middlewareBuilder)
            .map(builderFactory => builderFactory(this.container))
            .filter(middlewareBuilder => middlewareBuilder.supportsRouter(router));
    }
}