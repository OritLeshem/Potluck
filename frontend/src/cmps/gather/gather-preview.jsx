import { Link } from "react-router-dom";

export function GatherPreview({ gather, onUpdateGather, onRemoveGather, onGuestList }) {
  return <section >
    <li key={gather._id} className='gather-preview'>
      <h2>{gather.title}</h2>
      <h4>{gather.description}</h4>
      <h3>{new Date(gather.myDate).toLocaleDateString().replace(/\//g, '-')}</h3> {/* Replace slashes with dashes */}
      <div className="gather-btn-container">
        <button title='delete event?' className='button-preview fa-regular trash-can' onClick={() => onRemoveGather(gather._id)}></button>
        <button title='edit event?' className="button-preview fa-solid pen-to-square" onClick={() => onUpdateGather(gather)}></button>
        <button title='Who is invited?' className="button-preview fa-solid users" onClick={() => onGuestList(gather)}></button>
        <Link to={`/list/${gather._id}`} title='what to bring?' className="button-preview fa-solid list" ></Link>
        <Link to={`/chat/${gather._id}`} title='chat of this event' className="button-preview fa-regular comment" ></Link>
      </div>
    </li>
  </section>
}