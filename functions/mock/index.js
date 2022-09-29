(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.mock = factory());
}(this, (function () { 'use strict';

	const data = Object.assign({},);

	return data;

})));
