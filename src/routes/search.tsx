import { A, createAsync, useSubmission } from "@solidjs/router"
import { createEffect, createSignal, For, Show } from "solid-js"
import { getPublicListsQuery, searchPublicListsAction } from "~/api/lists/lists.actions"
import { List } from "~/api/models/list.model"

export const route = {
  preload() {
    //getPublicListsQuery()
  }
}

export default function SearchPage() {
  //const publicLists = createAsync(() => getPublicListsQuery())
  const [lists, setLists] = createSignal<List[]>([])
  const searchSubmission = useSubmission(searchPublicListsAction);

  createEffect(() => {
    if (searchSubmission.result) {
      console.log(searchSubmission.result);
      setLists(searchSubmission.result.lists);
      searchSubmission.clear();
    }
  });

  return (
    <div class="flex flex-col">
      <div class="flex justify-center">
        <h1 class="text-2xl font-semibold">Search Public Lists</h1>
      </div>

      <div class="flex flex-col mt-8 space-y-4">
        <h2 class="text-xl font-semibold">Search by Name</h2>
        <form action={searchPublicListsAction} method="post" class="flex space-x-4">
          <label class="input">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" name="listname" class="grow" placeholder="Search" />
          </label>
          <button class="btn btn-info" type="submit">Search</button>
        </form>
      </div>

      <h2 class="text-xl font-semibold mt-8">Lists:</h2>

      <ul class="list bg-base-100 rounded-box shadow-md mt-4">
        <For each={lists()}>
          {(list) => (
            <li class="list-row">
              <div></div>
              <div class="flex flex-col justify-center">
                <div class="text-lg">{list.name}</div>
                <Show when={list.description}>
                  <div class="text-sm font-semibold opacity-60">{list.description}</div>
                </Show>
              </div>
              <A class="btn btn-square btn-ghost" aria-label="Edit list" href={list.isOwner ? '/lists/' + list.name : '/pub/' + list.id} title="Go to list">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </A>
            </li>
          )}
        </For>
      </ul>
      <Show when={!lists() || lists().length === 0}>
        <div>No lists found</div>
      </Show>
    </div>
  )
}