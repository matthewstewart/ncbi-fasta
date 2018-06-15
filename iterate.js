const ncbiRecord = require('./test/record.json');

// const keyToBeFound = 'Textseq-id_version';
const keyToBeFound = 'BioSource_subtype';
iterateObj(keyToBeFound, ncbiRecord).then(result => console.log(result));

async function iterateObj(key, obj){
	let foundObject;
	const isArray = o => (!!o) && (o.constructor === Array);
	const isObject = o => (!!o) && (o.constructor === Object);
	const needsIterating = o => isArray(o) || isObject(o);

	await (async function doIterate(o) {
		let childObject;
		for (let childObjectKey in o) {
			if (foundObject) return;
			childObject = o[childObjectKey];
			if (needsIterating(childObject)) {
				if (childObjectKey === key) {
					// console.log(childObject);
					foundObject = childObject;
				} else {
					await doIterate(childObject);
				}
			}
		}
	})(obj);

	return (async () => await foundObject)();
}
