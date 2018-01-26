import { InterceptorFactory } from './interceptor-factory';

export const BeforeExecution = InterceptorFactory((priority: number) => {
    return priority < 0 ? priority : -priority;
})