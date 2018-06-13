const fs = require('fs');
const axios = require('axios');
const parser = require('xml2json');

// start with clear
console.clear();


// Configuration 

// first parameter is source file path
let srcFilePath = process.argv[2];
let srcFileExists = srcFilePath && srcFilePath.length > 0 && fs.existsSync(srcFilePath);

// first parameter is source file path
let destFilePath = process.argv[3];
let destFileExists = destFilePath && destFilePath.length > 0;


initialize();


function initialize() {
	createDestFileFromNcbi(srcFilePath, destFilePath)
	.then(result => {
		fs.writeFileSync(destFilePath, JSON.stringify(result, null, '  '));
		console.log('complete');
	});
}

async function createDestFileFromNcbi(sourceFilePath, destinationFilePath) {
	try {
		// check if sourceFilePath is valid
		if(!sourceFilePath){ throw new Error('Source File Path Not Provided') }

		// read source file
		const sourceFile = await readSourceFile(sourceFilePath);

		// convert to json
		let sourceFileJson = await fastaToJson(sourceFile);

		// fetch ncbi data
		let ncbiData = await fetchNcbiData(sourceFileJson); 

		let ncbiDataObj = await convertNcbiData(ncbiData);

		return ncbiDataObj;
	} catch(error) {
		return error;
	}	
}

async function readSourceFile(sourceFilePath) {
	try {
		// check if sourceFilePath is valid
		if(!sourceFilePath){ throw new Error('Source File Path Not Provided') }
		
		// read source
		return fs.readFileSync(sourceFilePath, 'utf8');

	} catch(error) {
		return error;
	}
}


async function fastaToJson(fasta) {
	try {
		// check if sourceFilePath is valid
		if(!fasta){ throw new Error('No Fasta Data Found In Source File') }
		
		// split by '>'
		const fastaArray = fasta.split('>');

		// remove first item in array which is always blank
		fastaArray.shift();

		// create an empty array to hold the result fasta record objects
		let fastaObjArray = [];

		for(let i = 0; i < fastaArray.length; i++){
			// set record 
			let fastaRecord = fastaArray[i];
			
			// split record by space into array
			let fastaRecordArray = fastaRecord.split(' ');
			
			// take the first item in the array which should be accessionNo.version,
			// split by '.' into array, first item should be accessionNo,
			// the second item should be the version number
			let fastaRecordObj = {
				accessionNo: fastaRecordArray[0].split('.')[0],
				version: fastaRecordArray[0].split('.')[1],
				description: null,
				sequence: null
			};

			// remove the accession from the record to leave just description and sequence
			fastaRecordArray.shift();

			// rejoin remainder of array into new variable
			let fastaRecordPartial = fastaRecordArray.join(' ');

			// description and sequence are now separated by a '\n' character
			fastaRecordObj.description = fastaRecordPartial.split('\n')[0];
			fastaRecordObj.sequence = fastaRecordPartial.split('\n')[1];

			// if the accessionNo and version are valid, push to result array
			if(fastaRecordObj.accessionNo && fastaRecordObj.version){
				fastaObjArray.push(fastaRecordObj);
			}
		}

		return fastaObjArray;

	} catch(error) {
		return error;
	}	
}

async function fetchNcbiData(sourceFileJson){
	try {
		let accession = `${sourceFileJson[0].accessionNo}.${sourceFileJson[0].version}`;
		let url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=${accession}&rettype=json`;
		let responseXml = await axios.get(url);
		let responseXmlData = responseXml.data;
		let responseJsonObj = parser.toJson(responseXmlData, { object: true });
		return responseJsonObj;
	} catch(error) {
		return error;
	}
}

async function convertNcbiData(ncbiData){
	try {
		//let accession = await getValueByKeyFromObject('Textseq-id_accession', ncbiData);
		//let bioseqDescr = await getValueByKeyFromObject('Bioseq_descr', ncbiData);
		//console.log(`Accession: ${accession}`);
		//console.log(`Bioseq_descr: ${bioseqDescr}`);

		//let accession = await getFromObj('Textseq-id_accession', ncbiData);
		console.log('\n\n\n');

		//console.log(JSON.stringify(ncbiData['Bioseq-set']))

		let version = await getFromObj('Textseq-id_accession', JSON.stringify(ncbiData));
		let ncbiObj = {
			//accession,
			version
			//version: await getFromObj('Textseq-id_version', ncbiData)
		};		
		return ncbiObj;
	} catch(error) {
		return error;
	}	
}

async function getValueByKeyFromObject(key, obj){
	try {
		if(isObject(obj)){
			console.log('isObject');
			// if is object, iterate over keys for match
			//console.log(Object.keys(obj));
			for(let i = 0; i < Object.keys(obj).length; i++){
				//console.log(JSON.stringify(key))
				//console.log(JSON.stringify(Object.keys(obj)[i]))
				// of the key matches, return the object
				if(String(Object.keys(obj)[i]).trim() == String(key).trim()){ 
					console.log(`Found ${key}`);
					return obj[Object.keys(obj)[i]]; 
				} else {
					return await getValueByKeyFromObject(key, obj[Object.keys(obj)[i]]);
				}
			}
		} else if(isArray(obj)){
			console.log('isArray');
			for(let i = 0; i < obj.length; i++){
				console.log(obj[i])
				return await getValueByKeyFromObject(key, obj[i]);
			}
		} else {
			//return null;
		}
	} catch(error) {
		return error;
	}	
}

// async function getFromObj(key, obj){
// 	try {
// 		if(isObject(obj)){
// 			let objKeys = Object.keys(obj);
// 			for(let i = 0; i < objKeys.length; i++){
// 				let objKey = objKeys[i];
// 				let isMatch = objKey == key;
// 				let record = obj[objKey];
// 				console.log(`${key} = ${objKey} ? ${isMatch}`);
// 				if(isMatch){
// 					console.log('found');
// 					return record;
// 				} else if(isObject(record)){
// 					//console.log(obj[objKey]);
// 					await getFromObj(key, obj[objKey]);
// 				}
// 			}
// 		} else if(isArray(obj)){
// 			for(let i = 0; i < obj.length; i++){
// 				await getFromObj(key, obj[i]);
// 			}
// 		}
// 	} catch(error) {
// 		return error;
// 	}
// }


async function getFromObj(key, objStr){
	try {
		let obj = JSON.parse(objStr);
		console.log(obj.constructor);
		if(isArray(obj)){
			console.log('isArray')
			// for(let i = 0; i < obj.length; i++){
			// 	console.log(obj[i])
			// 	await getFromObj(key, obj[i]);	
			// }
		} else {
			for(let i = 0; i < Object.keys(obj).length; i++){
				//console.log('isObject')
				//let childObj = obj[Object.keys(obj)[i]];
				//console.log(Object.keys(obj)[i])
				//console.log(isObject(obj))
				// if(key == Object.keys(obj)[i]){
				// 	console.log('FOUND')
				// 	return childObj;
				// }
				// if(isObject(childObj) && Object.keys(childObj).length > 0){
				// 	//console.log(childObj);
				// 	await getFromObj(key, childObj);
				// }
			}
		}
	} catch(error) {
		return error;
	}
}



function isArray(a){
	return (!!a) && (a.constructor === Array);
}

function isObject(a){
	return (!!a) && (a.constructor === Object);
}