// Copyright (c) 2016 Frank Hellwig
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

'use strict';

const util = require('util');

const errors = {
    badRequest: {
        code: 400,
        text: "Bad Request"
    },
    unauthorized: {
        code: 401,
        text: "Unauthorized"
    },
    paymentRequired: {
        code: 402,
        text: "Payment Required"
    },
    forbidden: {
        code: 403,
        text: "Forbidden"
    },
    notFound: {
        code: 404,
        text: "Not Found"
    },
    methodNotAllowed: {
        code: 405,
        text: "Method Not Allowed"
    },
    notAcceptable: {
        code: 406,
        text: "Not Acceptable"
    },
    proxyAuthenticationRequired: {
        code: 407,
        text: "Proxy Authentication Required"
    },
    requestTimeout: {
        code: 408,
        text: "Request Timeout"
    },
    conflict: {
        code: 409,
        text: "Conflict"
    },
    gone: {
        code: 410,
        text: "Gone"
    },
    lengthRequired: {
        code: 411,
        text: "Length Required"
    },
    preconditionFailed: {
        code: 412,
        text: "Precondition Failed"
    },
    payloadTooLarge: {
        code: 413,
        text: "Payload Too Large"
    },
    uriTooLong: {
        code: 414,
        text: "URI Too Long"
    },
    unsupportedMediaType: {
        code: 415,
        text: "Unsupported Media Type"
    },
    rangeNotSatisfiable: {
        code: 416,
        text: "Range Not Satisfiable"
    },
    expectationFailed: {
        code: 417,
        text: "Expectation Failed"
    },
    imATeapot: {
        code: 418,
        text: "I'm a teapot"
    },
    misdirectedRequest: {
        code: 421,
        text: "Misdirected Request"
    },
    unprocessableEntity: {
        code: 422,
        text: "Unprocessable Entity"
    },
    locked: {
        code: 423,
        text: "Locked"
    },
    failedDependency: {
        code: 424,
        text: "Failed Dependency"
    },
    unorderedCollection: {
        code: 425,
        text: "Unordered Collection"
    },
    upgradeRequired: {
        code: 426,
        text: "Upgrade Required"
    },
    preconditionRequired: {
        code: 428,
        text: "Precondition Required"
    },
    tooManyRequests: {
        code: 429,
        text: "Too Many Requests"
    },
    requestHeaderFieldsTooLarge: {
        code: 431,
        text: "Request Header Fields Too Large"
    },
    unavailableForLegalReasons: {
        code: 451,
        text: "Unavailable For Legal Reasons"
    },
    internalServerError: {
        code: 500,
        text: "Internal Server Error"
    },
    notImplemented: {
        code: 501,
        text: "Not Implemented"
    },
    badGateway: {
        code: 502,
        text: "Bad Gateway"
    },
    serviceUnavailable: {
        code: 503,
        text: "Service Unavailable"
    },
    gatewayTimeout: {
        code: 504,
        text: "Gateway Timeout"
    },
    httpVersionNotSupported: {
        code: 505,
        text: "HTTP Version Not Supported"
    },
    variantAlsoNegotiates: {
        code: 506,
        text: "Variant Also Negotiates"
    },
    insufficientStorage: {
        code: 507,
        text: "Insufficient Storage"
    },
    loopDetected: {
        code: 508,
        text: "Loop Detected"
    },
    bandwidthLimitExceeded: {
        code: 509,
        text: "Bandwidth Limit Exceeded"
    },
    notExtended: {
        code: 510,
        text: "Not Extended"
    },
    networkAuthenticationRequired: {
        code: 511,
        text: "Network Authentication Required"
    }
};

// Maps codes to their text description (e.g., 404 -> 'Not Found').
const byCode = {};

// Populate the byCode object.
Object.keys(errors).forEach(key => {
    let error = errors[key];
    byCode[error.code] = error.text;
});

// Given a code, returns the text description.
function findText(code) {
    return byCode[code] || 'Unknown Code';
}

// The template for the toHtml() method.
const htmlTemplate =
    '<div style="font-family:monospace;font-size:1.2em;margin:1em">' +
    '<p><strong>%d (%s)</strong></p><p>%s</p>' +
    '</div>';

class HttpsError extends Error {

    constructor(code, message) {
        super(message);
        this.name = 'HttpsError';
        this._code = code;
        this._text = findText(code);
    }

    get code() {
        return this._code;
    }

    get text() {
        return this._text;
    }

    toString() {
        return util.format('Error: %d (%s) %s',
            this.code, this.text, this.message);
    }

    toJson() {
        return {
            status: 'error',
            code: this.code,
            text: this.text,
            message: this.message
        };
    }

    toHtml() {
        return util.format(htmlTemplate, this.code, this.text, this.message);
    }
}

// Create a static factory method for each error. The factory method takes
// an error object or one or more arguments that are passed to util.format.
Object.keys(errors).forEach(key => {
    let code = errors[key].code;
    HttpsError[key] = function(err) {
        if (err instanceof Error) {
            return new HttpsError(code, err.message);
        } else {
            let args = Array.prototype.slice.call(arguments);
            let message = util.format.apply(util, args);
            return new HttpsError(code, message);
        }
    }
});

module.exports = HttpsError;
