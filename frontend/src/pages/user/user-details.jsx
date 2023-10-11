import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../../store/user.actions'
import { store } from '../../store/store'
import { showSuccessMsg } from '../../services/event-bus.service'
// import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../../services/socket.service'
import { userService } from '../../services/user.service'
import { uploadService } from '../../services/upload.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../../services/socket.service-copy'

export function UserDetails() {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.user)
  const watchedUser = useSelector(storeState => storeState.userModule.watchedUser)

  const [userToEdit, setUserToEdit] = useState(user || userService.getDefaultUser())
  const [imgUrl, setImgUrl] = useState(null)

  useEffect(() => {
    loadUser(params.id)

    socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }

  }, [])

  function onUserUpdate(user) {
    showSuccessMsg(`This user ${user.fullname} just got updated from socket`)
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }
  function handleChange({ target }) {
    let { value, type, name: field } = target
    value = type === 'number' ? +value : value
    setUserToEdit((prev) => ({ ...prev, [field]: value }))
  }
  function onSaveUser() {
    console.log('save user')
  }

  async function onUploadImg(ev) {
    try {
      const newImgUrl = await uploadService.uploadImg(ev)
      setUserToEdit((prev) => ({ ...prev, imgUrl: newImgUrl }))
      setImgUrl(newImgUrl)
      showSuccessMsg('saved img!')
    }
    catch (err) {
      console.log('err:', err)
    }
  }

  const onEditImgClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.addEventListener('change', onUploadImg)
    input.click()
  }
  return (

    <section className="gather-edit user-details">
      <h1>{user ? 'Edit profile' : 'Signin'}</h1>

      <form onSubmit={onSaveUser}>
        <label htmlFor="">Fullname:</label>
        <input name="title" type="text" onChange={handleChange} value={userToEdit.fullname} />
        <label htmlFor="">Username:</label>
        <input
          name="description"
          type="text"
          onChange={handleChange}
          value={userToEdit.username}
        />
        <label htmlFor="">Password:</label>
        <input name="myDate" type="text" onChange={handleChange} value={userToEdit.password} />
        <label htmlFor="">Profile image:</label>
        <input name="location" type="text" onChange={handleChange} value={userToEdit.imgUrl} />
        <img className='user-profile-img' onClick={onEditImgClick} src={userToEdit.imgUrl} />
        <button className="button-add">{user ? 'Update' : 'Add'}</button>
      </form>
    </section>


  )
}