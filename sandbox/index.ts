import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car', {
		color: 'red',
		year: '2020',
		// engine: {
		// 	cylinder: 8
		// },
		// owner: null || '',
		// service: undefined || ''
	})

	const car = await client.hGetAll('car');
	console.log(car);
};
run();
