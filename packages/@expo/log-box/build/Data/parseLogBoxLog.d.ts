/**
 * Copyright (c) 650 Industries.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Category, CodeFrame, LogBoxLogData, Message, MetroStackFrame } from './Types';
type ExceptionData = any;
export type ExtendedExceptionData = ExceptionData & {
    isComponentError: boolean;
    [key: string]: any;
};
export declare function parseInterpolation(args: readonly any[]): {
    category: Category;
    message: Message;
};
export declare function parseLogBoxException(error: ExtendedExceptionData): LogBoxLogData;
export declare function isError(err: any): err is Error;
export declare function parseLogBoxLog(args: any[]): {
    componentStack: MetroStackFrame[];
    category: Category;
    message: Message;
};
/**
 * Not used in Expo code, but required for matching exports with upstream.
 * https://github.com/krystofwoldrich/react-native/blob/7db31e2fca0f828aa6bf489ae6dc4adef9b7b7c3/packages/react-native/Libraries/LogBox/Data/parseLogBoxLog.js#L220
 */
export declare function parseComponentStack(message: string): {
    type: 'stack';
    stack: readonly CodeFrame[];
};
export {};
