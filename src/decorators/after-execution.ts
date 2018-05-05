import { InterceptorFactory } from './interceptor-factory';
import { ExecutionOrder } from "ts-hub";

export const AfterExecution = InterceptorFactory(ExecutionOrder.PostAcivation)
