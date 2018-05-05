import { InterceptorFactory } from './interceptor-factory';
import { ExecutionOrder } from "ts-hub";

export const BeforeExecution = InterceptorFactory(ExecutionOrder.PreActivation)