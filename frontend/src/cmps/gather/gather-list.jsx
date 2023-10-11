import { GatherPreview } from "./gather-preview";

export function GatherList({ gathers, onRemoveGather, onUpdateGather, onGuestList }) {
  return <section className="gather-list">
    <ul >
      {gathers.map(gather =>
        <GatherPreview gather={gather} onRemoveGather={onRemoveGather} onUpdateGather={onUpdateGather} onGuestList={onGuestList} />

      )}
    </ul>

  </section>
}