import { MetadataRouteReader } from './../routed-controller/reader/metadata-route-reader';
import { MetadataParameterReader } from './../routed-controller/reader/metadata-parameter-reader';
import { MetadataControllerLoader } from './../controller/loader/metadata-controller-loader';
import { MetadataMiddlewareReader } from './../routed-controller/reader/metadata-middleware-reader';
import { MetadataActivationContextProvider } from '../routed-controller/activator/metadata-activation-context-provider';
import { HubContainer, RoutedTsFramework } from 'ts-hub';

export class DecoratedFrameworkBuilder {

    private routeReader: MetadataRouteReader;
    private paramsReader: MetadataParameterReader;
    private controllerLoader: MetadataControllerLoader;
    private middlewareReader: MetadataMiddlewareReader;
    private activationContextProvider: MetadataActivationContextProvider;
    
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

    public withActivationContextProvider(activationContextProvider: MetadataActivationContextProvider) : this {
        this.activationContextProvider = activationContextProvider;
        return this;
    }
    
    public buildDecoratedFramework(container: HubContainer): RoutedTsFramework {
        this.controllerLoader || (this.controllerLoader = new MetadataControllerLoader());
        this.routeReader || (this.routeReader = new MetadataRouteReader(container));
        this.middlewareReader || (this.middlewareReader = new MetadataMiddlewareReader(container));
        this.activationContextProvider || (this.activationContextProvider = new MetadataActivationContextProvider(container));
        this.paramsReader || (this.paramsReader = new MetadataParameterReader(container));

        var framework = new RoutedTsFramework(
            this.controllerLoader,
            this.routeReader,
            this.middlewareReader,
            this.activationContextProvider,
            this.paramsReader);
        
        this.reset();
        return framework;
    }

    public reset(): void {
        this.withContollerLoader(null)
            .withActivationContextProvider(null)
            .withMiddlewareReader(null)
            .withParameterReader(null)
            .withRouteReader(null);
    }
}