export interface ClassMetadata<Information> {
    withInformation(information: Information): this;
    withTarget(target: any): this;
}