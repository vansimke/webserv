import { ServerResponse } from 'http';
import { spy, stub } from 'sinon';
import { Handler } from 'src/handlers/Handler';
import { IncomingMessage } from 'http';
import * as mockery from 'mockery';
import { IRequire } from 'dojo/loader';

declare const require: IRequire;

export async function loadMockModule<T = any>(mid: string, mocks: {
	[ key: string ]: any
}, useDefault = true): Promise<T> {
	mockery.deregisterAll();
	mockery.resetCache();
	mockery.enable({
		useCleanCache: true,
		warnOnReplace: true,
		warnOnUnregistered: false
	});

	for (let key in mocks) {
		mockery.registerMock(key, mocks[key]);
	}

	return new Promise<T>(function (resolve) {
		require([ require.toUrl(mid) ], function (module) {
			console.log(useDefault, module);
			resolve( useDefault ? module.default : module );
		});
	});
}

export function cleanupMockModules() {
	mockery.disable();
}

export function createMockMiddleware(): Handler {
	const middleware: Handler = <Handler> {
		handle: spy(function () {
			return Promise.resolve();
		})
	};
	return <Handler> middleware;
}

export function createMockResponse(): ServerResponse {
	const response = {
		finished: true,
		end: spy(function (_message: string, cb: Function) {
			cb();
		})
	};
	return <any> response;
}

export function createMockRequest(): IncomingMessage {
	const request = { };

	return <any> request;
}

export function createMockServer() {
	return {
		close: stub(),

		listen: spy(function (_port: string, resolve: Function) {
			resolve();
		}),

		on: stub()
	};
}
