import { createClient, defineScript } from 'redis';
import { itemsKey, itemsByViewsKey, itemsViewsKey } from '$services/keys';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
				return redis.call('SET', KEYS[1], 1 + tonumber(ARGV[1]))
			`,
			transformArguments(key: string, value: number) {
				return [key, value.toString()];
				// ['books:count', '5']
				// EVALSHA <ID> 1 'books:count' '5'
			},
			transformReply(reply: any) {
				return reply;
			}
		}),
		incrementViews: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
				local itemsViewsKey = KEYS[1]
				local itemsKey = KEYS[2]
				local itemsByViewsKey = KEYS[3]
				local userId = ARGV[1]
				local itemId = ARGV[2]
				
				local inserted = redis.call('PFADD', itemsViewsKey, userId)
				if inserted == 1 then
					redis.call('HINCRBY', itemsKey, 'views', 1)
					redis.call('ZINCRBY', itemsByViewsKey, 1, itemId)
				end
			`,
			transformArguments(itemId: string, userId: string) {
				return [
					itemsViewsKey(itemId), // -> items:views#asdf
					itemsKey(itemId),
					itemsByViewsKey(),
					itemId,
					userId
				];
			},
			transformReply() {
			}
		})
	}
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
