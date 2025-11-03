"use server"
import { redirect } from "@solidjs/router";
import { getRequestEvent, RequestEvent } from "solid-js/web";
import { type Locals } from "../models/locals.model";
import { addList, deleteAllDone, deleteList, deleteListItem, editListItem, getAllLists, getList, getLists, getPublicList, newListItem, toggleDone } from "./lists.service";

function getRequest(): [RequestEvent, Locals] {
  const requestEvent = getRequestEvent();
  if (requestEvent) {
    if (requestEvent.locals.user) {
      return [requestEvent, {user: requestEvent.locals.user, session: requestEvent.locals.session}];
    } else {
      throw redirect("/login");
    }
  } else {
    throw "Not a server request";
  }
}

function getFormData(form: FormData, key: string, required: boolean = false, type: string = "string") {
  if (form.get(key)) {
    const value = form.get(key);
    if (typeof value !== type) {
      throw `Invalid type for: ${key}`;
    }
		return form.get(key);
	}
  if (required) {
    throw "Value not found in form";
  }
	return undefined;
}

export async function getUserLists() {
  const [,locals] = getRequest();
  const lists = await getLists(locals.user.id)
  return {lists: lists};
}

export async function newList(form: FormData) {
  const [, locals] = getRequest();
  const name = form.get('name') as string | null;
  if (!name) {
    throw "Missing name field";
  }
  const description = form.get('description') as string | null;
  const checkPrivate = form.get('private');
  const isPrivate = checkPrivate !== null && checkPrivate === 'on';
  const listType = form.get('listType');
  if (listType) {
    if (listType !== "wishlist" && listType !== "checklist") {
      throw "Invalid list type";
    }
  }
  await addList(name, locals.user.id, description || undefined, isPrivate, listType || undefined as any);
  return {message: `Added List ${name}`};
}

export async function removeList(form: FormData) {
  const [, locals] = getRequest();
  const formId = form.get('id');
  if (formId) {
    await deleteList(formId as string, locals.user.id);
    return {message: `List Deleted`}
  } else {
    throw "Missing List ID";
  }
}

export async function getItems(listname: string) {
  if (listname && typeof listname === "string") {
    const [, locals] = getRequest();
    const list = await getList(decodeURIComponent(listname), locals.user.id);
    if (list) {
      return list
    } else {
      throw "list not found"
    }
  } else {
    throw "invalid listname";
  }
}

export async function newChecklistItem(form: FormData) {
  const [, locals] = getRequest();
  const name = form.get("name");
  const listId = form.get("listId");
  if (!name && typeof name !== "string") {
    throw "Invalid name";
  }
  if (!listId && typeof name !== "string") {
    throw "Invalid list";
  }
  await newListItem({name: name as string, autoDelete: false}, locals.user.id, listId as string);
  return { message: "Item Added" };
}

export async function newWishlistItem(form: FormData) {
  const [, locals] = getRequest();
  const name = getFormData(form, 'name', true) as string;
	const url = getFormData(form, 'link') as string | undefined;
	const price = getFormData(form, 'price') as string | undefined;
	const description = getFormData(form, 'description') as string | undefined;
	const autoDelete = form.get('autoDelete') !== null && form.get('autoDelete') === 'on';
	const listId = getFormData(form, 'listId', true) as string;
  await newListItem({
    name: name, 
    description: description,
    url: url,
    price: price,
    autoDelete: autoDelete
  }, locals.user.id, listId);
  return {message: "Item Added"};
}

export async function deleteCheckedItems(form: FormData) {
  const [, locals] = getRequest();
  const listId = getFormData(form, "listId", true) as string;
  await deleteAllDone(listId, locals.user.id);
  return {message: "Deleted Done Items"};
}

export async function toggleComplete(itemId: string | number) {
  if (!itemId) {
    throw "Missing item info"
  }
  const [, locals] = getRequest();
  await toggleDone(+itemId, locals.user.id);
}

export async function removeListItem(form: FormData) {
  const [, locals] = getRequest();
  const itemId = getFormData(form, 'itemId', true) as string;
	const listId = getFormData(form, "listId", true) as string;
  await deleteListItem(+itemId, locals.user.id, listId);
  return {message: "Deleted list item"};
}

export async function updateListItem(form: FormData) {
  const [, locals] = getRequest();
  const name = getFormData(form, 'name', true) as string;
  const listId = getFormData(form, 'listId', true) as string;
  const itemId = getFormData(form, "itemId", true) as string;
  const url = getFormData(form, 'link') as string | undefined;
	const price = getFormData(form, 'price') as string | undefined;
	const description = getFormData(form, 'description') as string | undefined;
	const autoDelete = form.get('autoDelete') !== null && form.get('autoDelete') === 'on';
  await editListItem(+itemId, {
    name: name,
    description: description,
    url: url,
    price: price,
    autoDelete: autoDelete
  }, locals.user.id, listId);
  return {message: "Updated list item"};
}

export async function getPublicLists() {
  const lists = await getAllLists(true);
  return {lists: lists}
}

export async function getPublicListItems(listId: string) {
  const list = await getPublicList(listId);
  return list;
}

