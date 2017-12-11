import { MetadataRouteReader } from './../routed-controller/reader/metadata-route-reader';
import { MetadataParameterReader } from './../routed-controller/reader/metadata-parameter-reader';
import { MetadataControllerLoader } from './../controller/loader/metadata-controller-loader';
import { MetadataMiddlewareReader } from './../routed-controller/reader/metadata-middleware-reader';
import { MetadataFunctionReader } from './../routed-controller/reader/metadata-function-reader';
import { HubContainer, RoutedTsFramework } from 'ts-hub';

export class DecoratedFrameworkBuilder {

    private routeReader: MetadataRouteReader;
    private paramsReader: MetadataParameterReader;
    private controllerLoader: MetadataControllerLoader;
    private middlewareReader: MetadataMiddlewareReader;
    private functionReader: MetadataFunctionReader;
    
    private static _instance: DecoratedFrameworkBuilder;
    public static get instance() {
        return this._instance || (this._instance = new DecoratedFrameworkBuilder());
    }

    private constructor() {

    }

    public withRouteReader(routeReader: MetadataRouteReader) : this {
        this.routeReader = routeReader;
        return this;
    }

    public withParameterReader(paramsReader: MetadataParameterReader) : this {
        this.paramsReader = paramsReader;
        return this;
    }

    public withContollerLoader(metadataControllerLoader: MetadataControllerLoader) : this {
        this.controllerLoader = metadataControllerLoader;
        return this;
    }

    public withMiddlewareReader(middlewareReader: MetadataMiddlewareReader) : this {
        this.middlewareReader = middlewareReader;
        return this;
    }

    public withFunctionReader(functionReader: MetadataFunctionReader) : this {
        this.functionReader = functionReader;
        return this;
    }
    
    public buildDecoratedFramework(container: HubContainer): RoutedTsFramework {
        this.controllerLoader || (this.controllerLoader = new MetadataControllerLoader());
        this.routeReader || (this.routeReader = new MetadataRouteReader(container));
        this.middlewareReader || (this.middlewareReader = new MetadataMiddlewareReader(container));
        this.functionReader || (this.functionReader = new MetadataFunctionReader(container));
        this.paramsReader || (this.paramsReader = new MetadataParameterReader(container));

        return new RoutedTsFramework(
            this.controllerLoader,
            this.routeReader,
            this.middlewareReader,
            this.functionReader,
            this.paramsReader);
    }
}