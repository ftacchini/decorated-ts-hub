import {ClassMetadata} from "./class-metadata";
import {MethodMetadata} from "./method-metadata";
import {ArgumentMetadata} from "./argument-metadata";
import * as _ from "lodash";

export class ControllerMetadataReader {

    private static _instance: ControllerMetadataReader;
    public static get instance(): ControllerMetadataReader {
        return this._instance || (this._instance = new ControllerMetadataReader());
    }

    private constructor() {

    }

    public readControllerLevelMetadata<T>(metadataTags: symbol[], target: Object) : T[] {
        return this.readMetadata<T>(metadataTags, target);   
    }

    public readMethodLevelMetadata<T>(metadataTags: symbol[], target: Object, property: string) : T[] {
        return this.readMetadata<T>(metadataTags, target, property);   
    }

    public readArgumentLevelMetadata<T>(metadataTags: symbol[], target: Object, property: string) : T[] {
        return this.readMetadata<T>(metadataTags, target, property);
    }

    public readMetadata<T>(metadataTags: symbol[], target: Object, property?: string): T[]{
        return _.flatten(metadataTags.map<any[]>((key) => { 
            return property ? Reflect.getMetadata(key, target, property) : Reflect.getMetadata(key, target) 
        }));

    }
}