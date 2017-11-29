export interface ClassMetadata<Information> {
    withInformation(information: Information): this;
    withTarget(information: Information): this;
}