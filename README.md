# https-error

Provides the `HttpsError` class and associated factory methods.

Version 1.0.2

## Usage

```
$ npm install --save https-error
```

```javascript
const HttpsError = require('https-error');

function sqrt(val) {
	if (val < 0) {
	    throw HttpsError.badRequest('Value %d cannot be negative.', val);
	} else {
	    return Math.sqrt(val);
    }
}

let err = HttpsError.internalServerError('Cannot connect to the database.');

console.log(err.toString());
// Error: 500 (Internal Server Error) Cannot connect to the database.

console.log(err.toJson());
// Outputs an object.

console.log(err.toHtml());
// Outputs an HTML string.
```

The `badRequest` method and `internalServerError` method are factory methods. No `new` keyword is required. There is one factory method for each of the 400- and 500-series errors.

If you want to call the constructor yourself, you can:

```javascript
function sqrt(val) {
	if (val < 0) {
	    throw new HttpsError(400, util.format('Value %d cannot be negative.', val));
	} else {
	    return Math.sqrt(val);
    }
}
```

As you can see, using the factory method...

- is more readable,
- does not require the `new` keyword,
- handles `util.format` arguments.

You can also pass in an `Error` object...

```javascript
let err = new Error('That record already exists.');

let conflict = HttpsError.conflict(err);

console.log(conflict.toString());
// Error: 409 (Conflict) That record already exists.
```

This is useful when wrapping a library error into an error for your REST API.
