import { HubContainer } from './../../core/container/hub-container';
import { MetadataParameterReader, MetadataFunctionReader, MetadataMiddlewareReader, MetadataRouteReader } from './../routed-controller';
import { MetadataControllerLoader } from './../controller';
import { ParameterReader, FunctionReader, MiddlewareReader, RouteReader, ControllerLoader, TsFramework, Types } from './../../core';
import { interfaces } from "inversify";

export class MetadataFramework implements TsFramework {

    constructor(private container: HubContainer) {
    }

    public setupFramework(): ControllerLoader{ 
        this.setupRouteReader()
            .setupMiddlewareReader()
            .setupFunctionReader()
            .setupParamsReader();

        return this.controllerLoader;
    }
    
    private setupRouteReader(): this {
        this.setupInstance(Types.RouteReader, this.routeReader);
        return this;
    }

    private setupMiddlewareReader(): this {
        this.setupInstance(Types.MiddlewareReader, this.middlewareReader);
        return this;
    }
    
    private setupFunctionReader(): this {
        this.setupInstance(Types.FunctionReader, this.functionReader);
        return this;
    }

    private setupParamsReader(): this {
        this.setupInstance(Types.ParamsReader, this.paramsReader);
        return this;
    }

    private setupInstance(symbol: symbol, instance: Object) {
        this.container.bind(symbol).toConstantValue(instance);
    }

    private _controllerLoader: ControllerLoader;
    get controllerLoader(): ControllerLoader {
        return this._controllerLoader || (this._controllerLoader = new MetadataControllerLoader());
    }

    private _routeReader: RouteReader;
    get routeReader(): RouteReader {
        return this._routeReader || (this._routeReader = new MetadataRouteReader(this.container));
    }
    
    private _middlewareReader: MiddlewareReader;
    get middlewareReader(): MiddlewareReader {
        return this._middlewareReader || (this._middlewareReader = new MetadataMiddlewareReader(this.container));
    }
    
    private _functionReader: FunctionReader;
    get functionReader(): FunctionReader {
        return this._functionReader || (this._functionReader = new MetadataFunctionReader(this.container));
    }
    
    private _paramsReader: ParameterReader;
    get paramsReader(): ParameterReader {
        return this._paramsReader || (this._paramsReader = new MetadataParameterReader(this.container));
    }
}