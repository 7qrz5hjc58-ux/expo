import { MetroBuildError } from '../Data/BuildErrors';
/**
 * Called in expo/async-require/hmr, the return value passed thru multiple steps, eventually
 * being passed to LogBox.addException (check for MetroErrorType or fallback parses the object)
 * in the web runtime.
 */
export declare function parseWebHmrBuildErrors(data: object): MetroBuildError;
