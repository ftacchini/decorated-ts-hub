import { PARAMETER_BUILDER } from './../../helper/controller-metadata-keys';
import { ArgumentMetadata } from './../../helper/argument-metadata';
import { ControllerMetadataReader, ControllerMetadataKeys } from './../../helper';
import { injectable, inject } from 'inversify';
import { Types, ParameterReader, ParameterBuilder, HubContainer } from 'ts-hub';

@injectable()
export class MetadataParameterReader implements ParameterReader {

    private metadataTags: symbol[];
    
    constructor(@inject(Types.Container) private container: HubContainer) {
        this.metadataTags = [ControllerMetadataKeys.PARAMETER_BUILDER];
    }

    public readParameters<GenericRouter>(target: any, propertyKey: string, router: GenericRouter): ParameterBuilder<any, GenericRouter>[] {
        var builders = ControllerMetadataReader.instance
                            .readArgumentLevelMetadata<(container: HubContainer) => ParameterBuilder<any, GenericRouter>>(
                                this.metadataTags, target, propertyKey);
        
        return builders.filter(builderFactory => builderFactory)
                .map(builderFactory => builderFactory(this.container))
                .filter(param => param  && param.supportsRouter(router));
    }

    public readParameterType(target: any, propertyKey: any, arg: number): any {
        var paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey)
        return paramTypes && paramTypes.length && paramTypes[arg];
    }
}