import * as _ from 'lodash';
import { ControllerBuilder, ControllerLoader, HubContainer } from 'ts-hub';

import * as ControllerMetadataKeys from '../../helper/controller-metadata-keys';

var includeAll = require("include-all");
var path = require("path");
export class MetadataControllerLoader implements ControllerLoader {

    constructor(
        private baseDir?: string,
        private filePattern?: RegExp,
        private ignorePattern?: RegExp){
        
        }

    loadControllerBuilders(container: HubContainer) : ControllerBuilder[] {
        
        let controllerFiles = includeAll(<any>{
            dirname: path.join(process.cwd(), this.baseDir || ""),
            filter: this.filePattern || /(.+)\-controller\.js$/,
            excludeDirs: this.ignorePattern || /^\.(git|svn|node_modules)$/,
            flatten: true
        });

        let controllerBuilderFactory: ((container: HubContainer) => ControllerBuilder)[] = [];
        
        _.each(_.values(controllerFiles), (exportedData: any) => {

            let arrayOfMetadata =  _.map<any, any[]>(exportedData, (value: any) => {
                return Reflect.getMetadata(ControllerMetadataKeys.CONTROLLER_BUILDER, value);
            });
            let flattenMetadata = _.flatten(arrayOfMetadata); 
            let filteredExports = _.filter<((container: HubContainer) => ControllerBuilder)>(flattenMetadata, value => value);
            
            controllerBuilderFactory = _.union(controllerBuilderFactory, filteredExports);
        });
        
        return controllerBuilderFactory.map(factory => factory(container));
    }

    
}