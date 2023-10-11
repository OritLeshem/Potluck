import { useState } from "react"
import { userService } from "../../services/user.service"

export function UserSearch({ onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(userService.getDefaultFilter())

  function handleChange({ target }) {
    let { value, name: field, type } = target
    value = (type === 'number') ? +value : value
    // setFilterByToEdit((prevFilter) => ({ ...prevFilter, fullname: value }))
    const updatedFilter = { ...filterByToEdit, fullname: type === 'number' ? +value : value };
    setFilterByToEdit(updatedFilter);
    onSetFilter(updatedFilter);

  }
  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }
  return <section>



    {/* <form className="search-guest-container" onSubmit={onSubmitFilter}> */}
    <form className="search-guest-container" >

      <button className="search-guest-button fa-solid magnifying-glass"></button>
      <input className="search-guest"
        type="text"
        onChange={handleChange}
        placeholder=" Search friends or guests"

      />
    </form>
  </section>
}