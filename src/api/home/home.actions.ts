import { query, redirect } from "@solidjs/router";
import { getLists } from "../lists/lists.service";
import { getUserLocals } from "../users/users.controller";

async function getHomeData() {
  "use server"
  const user = await getUserLocals();
  const lists = await getLists(user.id, 5, true);
  return {user: user, lists: lists}
}

export const getHomeDataQuery = query(getHomeData, "homeData");

