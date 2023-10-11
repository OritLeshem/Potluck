import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import { addUserToApprovedGuest, loadGather, loadGathers, removeUserFromApprovedGuest } from "../../store/gather/gather.actions";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { light } from "@mui/material/styles/createPalette";
import { loadUsers } from "../../store/user.actions";
import { UserSearch } from "../../cmps/user/user-search";
import { SET_FILTER } from "../../store/user.reducer";

export function GatherGuestListIndex() {
  const gather = useSelector(storeState => storeState.gatherModule.gather);
  const users = useSelector(storeState => storeState.userModule.users);
  const filterBy = useSelector(storeState => storeState.userModule.filterBy);

  const dispatch = useDispatch()
  const { gatherId } = useParams();

  useEffect(() => {
    loadUsers(filterBy)
    loadGathers();
    onLoadGather(gatherId);
  }, [gatherId, filterBy]);

  async function onLoadGather(gatherId) {
    try {
      await loadGather(gatherId);
      showSuccessMsg('Gather set');
    } catch (err) {
      showErrorMsg('Cannot set gather');
    }
  }

  function onSetFilter(filterBy) {
    console.log('filterBy', filterBy);
    dispatch({ type: SET_FILTER, filterBy })
  }
  async function onAddApprovedGuest(newUser) {

    // Handle saving a new user
    const existingGuest = gather.guestsApproved.find(
      (checkGuset) => checkGuset._id === newUser._id
    );
    if (existingGuest) {
      showErrorMsg("This guest is already in this list");
      return;
    }
    try {
      const savedGather = await addUserToApprovedGuest(gatherId, newUser);
      showSuccessMsg(`user "${newUser.fullname}" added to approved guests list "${gatherId}"`);
    } catch (err) {
      showErrorMsg(
        `Cannot add user "${newUser.fullname}" to approved guests list "${gatherId}": ${err}`
      );
    }
  }
  function onRemoveItem(gatherId, guestId) {
    removeUserFromApprovedGuest(gatherId, guestId);
    showSuccessMsg('guestId removed');
  }
  return <section className='gather-guest-list-index'>
    <h2>{gather?.title} guest:</h2>

    <UserSearch onSetFilter={onSetFilter} />

    {/* users */}
    <ul className="search-users-img-container" >
      <button className="guest-add-button fa-regular plus"></button>
      {users?.map(user => <li className="user-info" key={user._id}>
        <button className="user-img-button" onClick={() => onAddApprovedGuest(user)} > <img className='user-img' src={user.imgUrl} alt="" /></button>
        <span>{user.fullname.slice(0, 12)}{user.fullname.length > 12 && '...'}</span>
      </li>)}</ul>

    {/* approved Guest */}
    <ul>{gather?.guestsApproved.map(guest => <li className="guest-approved-li" key={guest._id}>
      <div className="guest-approved-info">
        <img className='guest-img' src={guest.imgUrl} alt="" />
        {guest.fullname}
      </div>
      <button
        className="button-remove-guest fa-regular trash-can"
        onClick={() => onRemoveItem(gatherId, guest._id)}
      ></button>
    </li>)} </ul>



  </section>
}