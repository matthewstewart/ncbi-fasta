const ncbiRecord = require('./test/record.json');



iterateObj('Textseq-id_version', ncbiRecord)
.then((result) => {
	console.log(result);
});


async function iterateObj(searchKey, obj){

		if(isObject(obj)){
			//console.log(Object.entries(obj));
			
			for (let [key, value] of Object.entries(obj)) {  
  			
  				//console.log(`Iterating ${key}`);
  				//console.log(value);
	  			//return value;
	  			if(key == searchKey){
	  				console.log('found');
	  				//console.log(value);
	  				return value;
	  			} else {
	  				//console.log('not found');
	  				let newVal = value;
	  				await iterateObj(searchKey, newVal);
	  			}
	  		
			}
			//let childObjectKeys = Object.keys(obj);
			//console.log(childObjectKeys);
			// childObjectKeys.forEach(async(childObjectKey) => {
			// 	//console.log(`${key} == ${childObjectKey}`);
			// 	let childObject = obj[childObjectKey];
			// 	if(key === childObjectKey){
			// 		console.log('found');
			// 		return childObject;
			// 	} else {
			// 		return await iterateObj(key, childObject);
			// 	}
			// });
			// for(let i = 0; i < childObjectKeys.length; i++){
			// 	let childObjectKey = childObjectKeys[i];
			// 	let childObject = obj[childObjectKey];
			// 	console.log(`${key} === ${childObjectKey}`);
			// 	if(key === childObjectKey){
			// 		console.log('found');
			// 		console.log(childObject);
			// 		return childObject;

			// 		//console.log(obj[childObjectKey]);
			// 		//console.log(childObject);

			// 	} else {
			// 		return await iterateObj(key, childObject);
			// 	}
			// }
		} else if(isArray(obj)){
			// console.log('Array');
			for(let i = 0; i < obj.length; i++){
				let childObject = obj[i];
				await iterateObj(searchKey, childObject);
			}
		}

}

function isArray(a){
	return (!!a) && (a.constructor === Array);
}

function isObject(a){
	return (!!a) && (a.constructor === Object);
}
