import { ClassMetadata } from './class-metadata';

export interface MethodMetadata<Information> extends ClassMetadata<Information>{
    withPropertyKey(propertyKey: string): this;
}