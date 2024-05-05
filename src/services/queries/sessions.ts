import type { Session } from '$services/types';
import {sessionsKeys} from '$services/keys';
import {client} from '$services/redis';

export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionsKeys(id))
	if (Object.keys(session).length === 0) {
		return null
	}
	return deserialize(id, session)
};

export const saveSession = async (session: Session) => {
	await client.hSet(sessionsKeys(session.id), serialize(session))
};

const serialize = (session: Session) => {
	return {
		userId: session.userId,
		username: session.username
	}
}

const deserialize = (id: string, session: {[key: string]: string}) => {
	return {
		id: id,
		userId: session.userId,
		username: session.username
	}
}