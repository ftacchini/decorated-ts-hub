/**
 * This decorator is required to expose method metadata,
 * making casting posible when no other attributes in a middleware
 * handler are annotated.
 */
export const CastParameterTypes = function (): any {
    return function (): any {

    }
}