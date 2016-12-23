'use strict';

var exec = require('child_process').execSync;

var utils = require('./utils.js');

module.exports = (args, returnDescription) => {

	if (returnDescription) {
		return 'Create your new Serverless service nodejs template';
	}

	if (args[3]) {
		var name = utils.safeString(args[3]);
	}
	else {
		console.error('! create-crud: Please specify the name of your resource...');
		process.exit();
	}

	var path = args[4] ? utils.safeString(args[4]) : name;

	var sourceFilepath = `${__dirname}/create-crud`;
	var targetFilepath = `${process.env.PWD}/${name}`;

	console.info(`* create-crud: Creating new CRUD resource '${name}'...`);

	exec(`cp -r ${sourceFilepath} ${targetFilepath} && cd ${targetFilepath} && `
		+ `sed -i '' 's:SLS_HQ_NAME:${name}:g' serverless.yml && `
		+ `sed -i '' 's:SLS_HQ_PATH:${path}:g' serverless.yml && `
		+ `npm install && cd ${process.env.PWD}`);

	console.info(`* create-crud: created new CRUD resource '${name}'`);

	require('./ensure-shared.js')(args);


	var dbDriver = args[5] ? utils.safeString(args[5]) : 'DynamoDB';

	require(`./create-${dbDriver}-model.js`)(args);

	console.info(`* create-crud: modifying config.yml with ${dbDriver} model table name...`);

	utils.appendLineToFile(`${name}DynamoDbTable: ` + '${self:appPrefix}-' + name, `${process.env.PWD}/shared/config.yml`);

	

};