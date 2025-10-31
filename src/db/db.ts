import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as groupSchema from "./schema/group";
import * as listItemSchema from "./schema/list-item"
import * as listSchema from "./schema/list";
import * as sessionSchema from "./schema/session";
import * as userSchema from "./schema/user";

config({path: ".env"});

const pg = neon(process.env.DATABASE_URL!);

export const db = drizzle({client: pg, schema: {
  ...groupSchema, ...listItemSchema, ...listSchema,
  ...sessionSchema, ...userSchema
}});