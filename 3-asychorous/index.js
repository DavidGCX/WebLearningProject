const { dir } = require('console');
const fs = require('fs');
const { get } = require('http');
const superagent = require('superagent');
const server = require('http').createServer();

const readFilePro = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err, data) => {
			if (err) reject('I could not find that file');
			resolve(data);
		});
	});
};

const writeFilePro = (file, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, (err) => {
			if (err) reject('could not write file');
			resolve('success');
		});
	});
};

const getPic = async () => {
	try {
		const date = await readFilePro(`${__dirname}/dog.txt`);
		console.log(`Breed: ${date}`);
		const res1 = superagent.get(
			`https://dog.ceo/api/breed/${date}/images/random`
		);
		const res2 = superagent.get(
			`https://dog.ceo/api/breed/${date}/images/random`
		);
		const res3 = superagent.get(
			`https://dog.ceo/api/breed/${date}/images/random`
		);
		const all = await Promise.all([res1, res2, res3]);
		const imgs = all.map((el) => el.body.message);
		await writeFilePro(`${__dirname}/dog-img.txt`, imgs.join('\n'));
		console.log('random dog image saved to file');
	} catch (err) {
		console.log(err.message);
		throw err;
	}
	return '2: ready';
};

(async () => {
	try {
		console.log('1: will get dog pics');
		const x = await getPic();
		console.log(x);
		console.log('3: done getting dog pics');
	} catch (err) {
		console.log(err.message);
	}
})();

/*
console.log('1: will get dog pics');

getPic()
	.then((x) => {
		console.log(x);
		console.log('3: done getting dog pics');
	})
	.catch((err) => {
		console.log(err.message);
		console.log('ERROR');
	});
	*/
/*
readFilePro(`${__dirname}/dog.txt`)
	.then((data) => {
		console.log(`Breed: ${data}`);
		return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
	})
	.then((res) => {
		console.log(res.body.message);
		return writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
	})
	.then(() => {
		console.log('random dog image saved to file');
	})
	.catch((err) => {
		console.log(err.message);
	});
*/
server.on('request', (req, res) => {
	fs.readFile(`${__dirname}/dog-img.txt`, (err, data) => {
		res.writeHead(200, { 'Content-type': 'text/html' });
		res.end(`<h1>your dog: </h1> 
        <img src="${data}" alt="dog" />`);
	});
});

server.listen(8000);
