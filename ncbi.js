const fs = require('fs');

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
	convertSourceFileToJson(srcFilePath)
	.then(result => {
		console.log(result);
	});
}

async function convertSourceFileToJson(sourceFilePath) {
	try {
		// check if sourceFilePath is valid
		if(!sourceFilePath){ throw new Error('Source File Path Not Provided') }

		// read source file
		const sourceFile = await readSourceFile(sourceFilePath);

		// convert to json
		const sourceFileJson = await fastaToJson(sourceFile);

		return sourceFileJson;
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

