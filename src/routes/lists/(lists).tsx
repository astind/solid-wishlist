import { createAsync, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";
import { deleteListAction, getListsQuery, newListAction } from "~/api/lists/lists.actions";

export const route = {
  preload() {
    getListsQuery()
  }
}

export default function ListsPage() {

  const lists = createAsync(() => getListsQuery());
  const newListSubmission = useSubmission(newListAction);
  const deleteListSubmission = useSubmission(deleteListAction);
  const [isNewOpen, setisNewOpen] = createSignal(false);
  const [deleteIndex, setDeleteIndex] = createSignal(-1);

  createEffect(() => {
    if (newListSubmission.result) {
      setisNewOpen(false);
    }
    if (deleteListSubmission.result) {
      setDeleteIndex(-1);
    }
  });
  
  return (
    <div class="flex flex-col">
      <div class="flex justify-end">
        <button class="btn btn-primary" onClick={() => setisNewOpen(true)}>New List</button>
      </div>
      <Show when={isNewOpen()}>
        <div class="flex justify-center">
          <form
            action={newListAction}
            method="post"
          >
            <fieldset class="fieldset bg-base-300 border-neutral rounded-box w-xs border p-4">
              <legend class="fieldset-legend">New List</legend>

              <label class="label" for="name">Name*</label>
              <input type="text" class="input" placeholder="Name" name="name" id="name" required />

              <label class="label" for="description">Description</label>
              <textarea class="textarea" placeholder="Description" id="description" name="description">
              </textarea>

              <label for="list-type" class="label">List Type</label>
              <select name="listType" id="list-type" class="select" required>
                <option disabled selected>Select a list type</option>
                <option value="wishlist">Wishlist</option>
                <option value="checklist">Checklist</option>
              </select>

              <label class="label mt-2">
                <input type="checkbox" class="checkbox" name="private" />
                Private
              </label>
              <div class="flex justify-end space-x-4">
                <button type="submit" class="btn btn-info">Save</button>
                <button type="button" class="btn btn-error" onClick={() => setisNewOpen(false)}>Cancel</button>
              </div>
              <Show when={newListSubmission.error}>
                <p class="mt-4 text-error">{newListSubmission.error}</p>
              </Show>
            </fieldset>
          </form>
        </div>
      </Show>

      <div class="flex justify-center mt-4">
        <h1 class="text-2xl font-semibold">Your Lists:</h1>
      </div>

      <ul class="list bg-base-100 rounded-box shadow-md mt-4">
        <For each={lists()?.lists}>
          {(list) => (
            <li class="list-row">
              <div></div>
              <div class="flex flex-col justify-center">
                <div class="text-lg">{list.name}</div>
                <Show when={list.description}>
                  <div class="text-sm font-semibold opacity-60">{list.description}</div>
                </Show>
                <Show when={deleteIndex() === list.id}>
                  <form
                    action={deleteListAction}
                    method="post"
                  >
                    <div class="flex justify-between items-center mt-2">
                      <p>Are you sure you want to delete this list? This action is permanent</p>
                      <input type="hidden" name="id" value={list.id} />
                      <div class="space-x-4">
                        <button type="submit" class="btn btn-error">Delete</button>
                        <button type="button" class="btn btn-success" onClick={() => setDeleteIndex(-1)}>Cancel</button>
                      </div>
                    </div>
                  </form>
                </Show>
              </div>
              <a class="btn btn-square btn-ghost" aria-label="Edit list" href={'/lists/' + list.name}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </a>
              <button
                class="btn btn-square btn-ghost"
                aria-label="Delete list"
                onClick={() => setDeleteIndex(list.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}