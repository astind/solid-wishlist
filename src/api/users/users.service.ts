"use server";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";
import { hash, verify } from '@node-rs/argon2';
import { userTable } from "../../db/schema/user";


function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}


export async function getExistingUser(username: FormDataEntryValue | null, password: FormDataEntryValue | null) {
  
	if (!validateUsername(username)) {
		throw 'Invalid username (min 3, max 31 characters, alphanumeric only)'
	}
	if (!validatePassword(password)) {
		throw 'Invalid password (min 6, max 255 characters)';
	}

	const results = await db.select().from(userTable).where(eq(userTable.username, username));

	const existingUser = results.at(0);
	if (!existingUser) {
		throw 'Incorrect username or password'
	}

	const validPassword = await verify(existingUser.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	if (!validPassword) {
		throw 'Incorrect username or password'
	}
  return existingUser.id;
}

export async function createNewUser(username: FormDataEntryValue | null, password: FormDataEntryValue | null) {

	if (!validateUsername(username)) {
		throw 'Invalid username';
	}
	if (!validatePassword(password)) {
		throw 'Invalid password';
	}

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

  let userId;
	try {
		const res = await db.insert(userTable).values({ username, passwordHash }).returning({generatedId: userTable.id});
		userId = res[0].generatedId;
	} catch (e) {
		console.error(e);
		throw "Failed to create user";
	}
	return userId;
}