import { client } from '$services/redis';
import { itemsKey, itemsByViewsKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	let results: any = await client.sort(
		itemsByViewsKey(),
		{
			GET: [
				'#',
				`${itemsKey('*')}->name`,
				`${itemsKey('*')}->views`,
				`${itemsKey('*')}->endingAt`,
				`${itemsKey('*')}->imageUrl`,
				`${itemsKey('*')}->price`
			],
			BY: 'nosort', // already sorted
			DIRECTION: order,
			LIMIT: {
				offset,
				count
			}

		}
	);

	const items = [];
	while (results.length) {
		const [id, name, views, endingAt, imageUrl, price] = results.splice(0, 6);
		items.push(deserialize(id, { name, views, endingAt, imageUrl, price }));
	}

	return items;
};
