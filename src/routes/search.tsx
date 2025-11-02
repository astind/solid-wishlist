import { A, createAsync } from "@solidjs/router"
import { For, Show } from "solid-js"
import { getPublicListsQuery } from "~/api/lists/lists.actions"

export const route = {
  preload() {
    getPublicListsQuery()
  }
}

export default function SearchPage() {
  const publicLists = createAsync(() => getPublicListsQuery())

  return (
    <div class="flex flex-col">
      <div class="flex justify-center">
        <h1 class="text-2xl font-semibold">Search Public Lists</h1>
      </div>
      <div class="flex justify-end mt-8">
        <p>Looking for groups? Check out the public groups page</p>
      </div>

      <h2 class="text-xl font-semibold mt-8">Lists:</h2>

      <ul class="list bg-base-100 rounded-box shadow-md mt-4">
        <For each={publicLists()?.lists}>
          {(list) => (
            <li class="list-row">
              <div></div>
              <div class="flex flex-col justify-center">
                <div class="text-lg">{list.name}</div>
                <Show when={list.description}>
                  <div class="text-sm font-semibold opacity-60">{list.description}</div>
                </Show>
              </div>
              <A class="btn btn-square btn-ghost" aria-label="Edit list" href={'/lists/' + list.name} title="Go to list">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </A>
            </li>
          )}
        </For>

      </ul>
    </div>
  )
}