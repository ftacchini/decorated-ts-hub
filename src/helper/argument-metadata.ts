import { MethodMetadata } from './method-metadata';

export interface ArgumentMetadata<Information> extends MethodMetadata<Information>{
    withArgumentIndex(arg: number): this;
}