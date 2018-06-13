const ncbiRecord = require('./test/record.json');

iterateObj('Textseq-id_version', ncbiRecord)
.then((result) => {
	console.log(result);
});


async function iterateObj(key, obj){

		if(isObject(obj)){
			//console.log('Object');
			let childObjectKeys = Object.keys(obj);
			//console.log(childObjectKeys);
			for(let i = 0; i < childObjectKeys.length; i++){
				let childObjectKey = childObjectKeys[i];
				let childObject = obj[childObjectKey];
				if(key === childObjectKey){
					console.log('found');
					console.log(childObject);
					return childObject;

					//console.log(obj[childObjectKey]);
					//console.log(childObject);

				} else {
					return await iterateObj(key, childObject);
				}
			}
		} else if(isArray(obj)){
			//console.log('Array');
			for(let i = 0; i < obj.length; i++){
				let childObject = obj[i];
				return await iterateObj(key, childObject);
			}
		}

}

function isArray(a){
	return (!!a) && (a.constructor === Array);
}

function isObject(a){
	return (!!a) && (a.constructor === Object);
}
