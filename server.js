const http = require('http')
const fs = require('fs')
const url = require('url');


const server = http.createServer((req, res) => {
	res.writeHead(200, { 'content-type': 'text/html' })

	const queryObject = url.parse(req.url,true).query;
	console.log(queryObject.room + " " + queryObject.cmd);

	const { spawnSync } = require( 'child_process' );
	const ls = spawnSync( '/home/zvika/RFXCMD/somfy.py', [ queryObject.room, queryObject.cmd ] );

	console.log( `stderr: ${ ls.stderr.toString() }` );
	console.log( `stdout: ${ ls.stdout.toString() }` );

	fs.createReadStream('index.html').pipe(res)
})

server.listen(8080)
