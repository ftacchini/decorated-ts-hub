import { InterceptorFactory } from './interceptor-factory';

export const AfterExecution = InterceptorFactory((priority: number) => {
    return priority > 0 ? priority : -priority;
})