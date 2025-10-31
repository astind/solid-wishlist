import { createSignal, Show } from "solid-js"

export type ListSettingsProp = {
  listname: string, 
  description: string | undefined,
  listType: "checklist" | "wishlist",
  private: boolean,
  groups?: any[],
  shared?: any[],
  modalId: string
}


export default function ListSettings(props: ListSettingsProp) {

  const [section, setSection] = createSignal("list");

  function closeModal() {
    const modal = document.getElementById(props.modalId) as any;
    modal?.close();
    setSection("list");
  }

  const onCheckboxChange = (event: any) => {
    setSection(event.target.value)
  }

  return (
    <div class="modal-box">
      <h3 class="text-lg font-bold">{props.listname} Settings:</h3>
        <div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
          <input type="radio" name="list-settings" value="list" checked={section() === 'list'} onChange={onCheckboxChange}/>
          <div class="collapse-title font-semibold">List Details</div>
          <div class="collapse-content">
            <form  method="post"> {/* add update list action */}
              <fieldset class="fieldset w-full px-4">
                <label class="label" for="name">Name:</label>
                <input type="text" id="name" class="input w-full" placeholder="Name" name="name" value={props.listname} />

                <label class="label" for="description">Description</label>
                <input type="text" class="input w-full" id="description" name="description" value={props.description} placeholder="Description" />

                <label class="label" for="list-type">List Type:</label>
                <select name="listType" id="list-type" class="select" value={props.listType}>
                  <option value="checklist">Checklist</option>
                  <option value="wishlist">Wishlist</option>
                </select>

                <label class="label mt-2">
                  <input type="checkbox" class="checkbox" name="private" checked={props.private} />
                  Private
                </label>
                <p class="label">Private lists cannot be found with a link.</p>
                <div class="flex justify-end space-x-4">
                  <button type="submit" class="btn btn-info">Save</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
          <input type="radio" name="list-settings" value="groups" checked={section() === 'groups'} onChange={onCheckboxChange}/>
          <div class="collapse-title font-semibold">List Groups</div>
          <div class="collapse-content">
            <Show when={props.groups?.length} fallback={<div>List has not been shared to any groups</div>}>
              <div>
                { 
                  // Add a for loop here
                }
              </div>
            </Show>
          </div>
        </div>

        <div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
          <input type="radio" name="list-settings" value="shared" checked={section() === 'shared'} onChange={onCheckboxChange}/>
          <div class="collapse-title font-semibold">Shared Users:</div>
          <div class="collapse-content">
            <Show when={props.shared?.length} fallback={<div>List has not been shared with any users</div>}>
              <div>
                { 
                  // Add a for loop here
                }
              </div>
            </Show>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn" type="button" onClick={closeModal}>Close</button>
        </div>
    </div>
  )
}