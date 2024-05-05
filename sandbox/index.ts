import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car1', {
		color: 'red',
		year: '2020',
	})

	await client.hSet('car1', {
		color: 'yellow',
		year: '2030',
	})

	await client.hSet('car1', {
		color: 'green',
		year: '2040',
	})

	const commands = [1, 2, 3].map((id) => {
		return client.hGetAll('car' + id);
	});

	const results = await Promise.all(commands)

	console.log(results);

};
run();
