var includeAll = require("include-all");
import * as _ from "lodash";
import {ControllerBuilder, HubContainer, ControllerLoader} from "../../../core";
import * as ControllerMetadataKeys from "../../helper/controller-metadata-keys";

export class MetadataControllerLoader implements ControllerLoader {

    constructor(
        private filePattern?: RegExp,
        private ignorePattern?: RegExp){
        
        }

    loadControllerBuilders(container: HubContainer) : ControllerBuilder[] {
        
        let controllerFiles = includeAll(<any>{
            dirname: process.cwd(),
            filter: this.filePattern || /(.+)\-controller\.js$/,
            excludeDirs: this.ignorePattern || /^\.(git|svn)$/,
            flatten: true
        });

        let controllerBuilderFactory: ((container: HubContainer) => ControllerBuilder)[] = [];
        
        _.each(_.values(controllerFiles), (exports: any) => {

            let filteredExports = _.filter(_.flatten(_.map(exports, (value: any) => {
                return Reflect.getMetadata(ControllerMetadataKeys.CONTROLLER_BUILDER, value);
            })), metadata => metadata);
            
            controllerBuilderFactory = _.union(controllerBuilderFactory, filteredExports);
        });
        


        return controllerBuilderFactory.map(factory => factory(container));
    }

    
}