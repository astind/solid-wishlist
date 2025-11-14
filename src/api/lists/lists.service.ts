"use server";
import { and, asc, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../db/db';
import { listTable, sharedListsTable } from '../../db/schema/list';
import { listItemTable } from '../../db/schema/list-item';
import { groupListsTable, groupMembersTable } from '~/db/schema/group';
import { ListSortOptions } from '../models/list.model';

export async function getLists(ownerId: string, limit?: number, orderByRecent: boolean = false) {
  let lists: any[] = [];
  try {
    let orderBy = [asc(listTable.rank), desc(listTable.dateCreated)];
    if (orderByRecent) {
      orderBy = [desc(listTable.lastUpdated), desc(listTable.dateCreated)];
    }
    const results = await db.query.listTable.findMany({
      columns: {
        id: true,
        name: true,
        description: true
      },
      where: eq(listTable.ownerId, ownerId),
      orderBy: orderBy,
      limit: limit
    });
    if (results.length) {
      lists = results;
    }
  } catch (e) {
    console.error(e);
    throw "Failed to get lists";
  }
  return lists;
}

export async function getAllLists(publicLists: boolean = true, userId?: string, limit?: number, name?: string) {
  let lists: any[] = [];
  let eqValue;
  if (publicLists) {
    eqValue = eq(listTable.private, false);
  } else {
    eqValue = or(eq(listTable.private, true), eq(listTable.private, false));
  }
  if (name) {
    eqValue = and(ilike(listTable.name, `%${name}%`), eqValue);
  }
  try {
    let results = await db.query.listTable.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
        ownerId: true
      },
      where: eqValue,
      orderBy: [desc(listTable.lastUpdated), desc(listTable.dateCreated)],
      limit: limit
    });
    if (results.length) {
      if (publicLists) {
        lists = results.map((value) => {
          let { ownerId, ...val } = value;
          let anyObj: any = val as any;
          if (userId) {
            anyObj["isOwner"] = value.ownerId === userId;
          }
          return anyObj;
        });
      } else {
        lists = results;
      }
    }
  } catch (error) {
    console.error(error);
    throw "Failed to get lists"
  }
  return lists
}

export async function addList(name: string, ownerId: string, description?: string, isPrivate: boolean = false, listType: "wishlist" | "checklist" = "wishlist") {
  try {
    await db.insert(listTable).values({
      name: name,
      ownerId: ownerId,
      description: description,
      listType: listType,
      private: isPrivate
    });
  } catch (e: any) {
    console.error(e);
    throw "Failed to create new list"
  }
}

export async function updateList(listId: string, name: string, ownerId: string, description?: string, isPrivate: boolean = false, listType: "wishlist" | "checklist" = "wishlist", listPassword?: string) {
  try {
    await db.update(listTable).set({
      name: name,
      description: description,
      private: isPrivate,
      lastUpdated: new Date(),
      listType: listType,
      listPassword: listPassword
    }).where(
      and(
        eq(listTable.ownerId, ownerId),
        eq(listTable.id, listId)
      )
    )
  }
  catch (e: any) {
    throw "Failed to update list";
  }
}

export async function deleteList(listId: string, ownerId: string) {
  try {
    await db.delete(listTable).where(
      and(
        eq(listTable.id, listId),
        eq(listTable.ownerId, ownerId)
      )
    );
  }
  catch (e: any) {
    console.error(e);
    throw "Failed to delete list";
  }
}

function getOrderByList(sortBy?: ListSortOptions) {
  let sort
  switch (sortBy) {
    case "date":
      sort = [desc(listItemTable.dateAdded)];
      break;

    case "name":
      sort  = [asc(listItemTable.name)];
      break;

    case "rank":
      sort = [asc(listItemTable.rank), desc(listItemTable.dateAdded)];
      break;

    case "price-up":
      sort = [desc(listItemTable.price), asc(listItemTable.rank), desc(listItemTable.dateAdded)];
      break;

    case "price-down":
      sort = [asc(listItemTable.price), asc(listItemTable.rank), desc(listItemTable.dateAdded)];
      break;

    default:
      sort = [desc(listItemTable.dateAdded), desc(listItemTable.name)]
      break;

  }

  return sort;
}

export async function getList(listName: string, ownerId: string, sortBy?: ListSortOptions) {
  try {
    const list = await db.query.listTable.findFirst({
      where: and(eq(listTable.name, listName), eq(listTable.ownerId, ownerId)),
      with: {
        items: {
          orderBy: getOrderByList(sortBy)
        },
        shared: true,
        groups: true
      }
    })
    return list;
  }
  catch (e: any) {
    console.error(e);
    throw "Failed to get list";
  }
}

export type ListItemFields = {
  name: string;
  description?: string;
  url?: string;
  price?: number | string;
  autoDelete: boolean;
}

async function updateListTimestamp(listId: string) {
  try {
    await db.update(listTable).set({ lastUpdated: new Date() }).where(
      eq(listTable.id, listId)
    )
  }
  catch (e: any) {
    console.error(e);
    console.error("Last updated date not updated");
  }
}

async function verifyListOwner(ownerId: string, listId: string) {
  try {
    const list = await db.query.listTable.findFirst({
      columns: { ownerId: true, id: true },
      where: eq(listTable.id, listId)
    });
    if (list?.ownerId !== ownerId) {
      throw "wrong owner"
    }
  }
  catch (e: any) {
    console.error(e);
    throw "Cannot verify list owner";
  }
}

export async function newListItem(listItem: ListItemFields, userId: string, listId: string, owner: boolean = true) {
  try {
    if (owner) {
      await verifyListOwner(userId, listId);
    } else {
      // check for shared list
    }
    const item = { ...listItem, listId: listId }
    await db.insert(listItemTable).values(item as any);
  }
  catch (e: any) {
    console.error(e);
    throw "Failed to add item(s) to list";
  }
  updateListTimestamp(listId);
}

export async function editListItem(itemId: number, listItem: ListItemFields, userId: string, listId: string, owner: boolean = true) {
  try {
    if (owner) {
      await verifyListOwner(userId, listId);
    }
    await db.update(listItemTable).set(listItem as any).where(eq(listItemTable.id, itemId));
  }
  catch (e: any) {
    console.error(e);
    throw "Failed to update list item";
  }
  updateListTimestamp(listId);
}

export async function deleteListItem(itemId: number, userId: string, listId: string, owner: boolean = true) {
  try {
    if (owner) {
      await verifyListOwner(userId, listId);
    }
    await db.delete(listItemTable).where(
      eq(listItemTable.id, itemId),
    );
  }
  catch (e: any) {
    console.error(e);
    throw "Failed to delete list item";
  }
  updateListTimestamp(listId);
}

export async function toggleDone(itemId: number, by?: string) {
  try {
    const item = await db.query.listItemTable.findFirst({
      where: eq(listItemTable.id, itemId),
      columns: {
        done: true,
        listId: true,
        doneBy: true,
      },
      with: {
        list: {
          columns: {
            private: true,
            listType: true,
            ownerId: true
          }
        }
      }
    });
    if (!item) {
      throw "Item not found";
    }
    if (item.list?.private && by !== item.list.ownerId) {
      if (!by) {
        throw "Missing UserId";
      }
      // check for shared list
      const sharedRecord = await db.query.sharedListsTable.findFirst({
        where: and(eq(sharedListsTable.listId, item.listId!), eq(sharedListsTable.userId, by))
      });
      if (!sharedRecord) {
        // check for groups
        const tableGroup = await db.query.groupListsTable.findFirst({
          where: eq(groupListsTable.listId, item.listId!),
        });
        if (tableGroup) {
          const memberRecord = await db.query.groupMembersTable.findFirst({
            where: and(eq(groupMembersTable.memberId, by), eq(groupMembersTable.groupId, tableGroup.groupId))
          });
          if (!memberRecord) {
            throw "Unauthorized";
          }
        } else {
          throw "Unauthorized";
        }
      }
    }
    let update: boolean = !item.done;
    let date = null;
    let byUser = null;
    if (!item.done) {
      date = new Date();
      if (by) {
        byUser = by;
      }
    }
    await db.update(listItemTable).set({
      done: update,
      doneBy: byUser,
      dateDone: date
    }).where(
      eq(listItemTable.id, itemId)
    );
  }
  catch (e: any) {
    console.error(e);
    if (typeof e === "string") {
      throw e;
    } else {
      throw "Failed to mark as complete/bought"
    }
  }
}

export async function deleteAllDone(listId: string, userId: string, owner: boolean = true) {
  try {
    if (owner) {
      await verifyListOwner(userId, listId);
    } else {
      //check for shared list
    }
    await db.delete(listItemTable).where(
      and(
        eq(listItemTable.listId, listId),
        eq(listItemTable.done, true)
      )
    );
  } catch (e: any) {
    console.error(e);
    throw "Failed to remove group";
  }
  updateListTimestamp(listId)
}

export async function getPublicList(listId: string, sortBy?: ListSortOptions) {
  try {
    const list = await db.query.listTable.findFirst({
      where: eq(listTable.id, listId),
      columns: {
        id: true,
        name: true,
        description: true,
        dateCreated: true,
        listType: true
      },
      with: {
        items: {
          orderBy: getOrderByList(sortBy || "rank")
        },
        owner: {
          columns: {
            username: true
          }
        }
      }
    });
    return list
  } catch (error) {
    console.error(error);
    throw "Failed to get list";
  }
}

export async function setFavorite(itemId: string, listId: string, userId: string) {
  try {
    await verifyListOwner(userId, listId);
    const item = await db.query.listItemTable.findFirst({
      columns: { favorite: true, }
    });
    if (item) {
      await db.update(listItemTable).set({
        favorite: !item?.favorite
      });
    } else {
      throw "can't find item";
    }
  } catch (error) {
    console.error(error);
    throw "Failed to toggle favorite";
  }
}

