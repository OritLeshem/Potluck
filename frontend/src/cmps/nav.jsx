import React, { useState } from 'react'
import './Nav.css'
import { AiOutlineHome } from 'react-icons/ai'
import { AiOutlineUser } from 'react-icons/ai'
import { BiBook } from 'react-icons/bi'
import { RiServiceLine } from 'react-icons/ri'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Nav = () => {
  const [activeNav, setActiveNav] = useState('#')
  const loggedInUser = useSelector(storeState => storeState.userModule.user)
  const location = useLocation();
  const gatherId = location.pathname.split('/')[2]; // Extract gatherId manually from pathname
  const path = location.pathname.split('/')[1]; // Extract the first part of the id

  if (path === 'gather' || path === 'user' || path === 'edit') return null
  else return (

    <div className="nav-bar">
      <Link to="/gather" onClick={() => setActiveNav('#')} className={activeNav === '#' ? 'active nav-bar-link' : 'nav-bar-link'}>
        <AiOutlineHome /></Link>
      {loggedInUser ? (
        <Link
          to={`/guest/${gatherId}`} title='who is invited?'
          onClick={() => setActiveNav('#portfolio')}
          className={activeNav === '#portfolio' ? 'active nav-bar-link' : 'nav-bar-link'}
        >
          <AiOutlineUser />
        </Link>
      ) : (
        <Link
          to="/" onClick={() => setActiveNav('#')} className={activeNav === '#' ? 'active nav-bar-link' : 'nav-bar-link'}><AiOutlineHome />
        </Link>
      )}
      <Link to={`/list/${gatherId}`} title='what to bring?' onClick={() => setActiveNav('#experience')} className={activeNav === '#experience' ? 'active nav-bar-link' : 'nav-bar-link'}><BiBook /></Link>
      <Link to={`/chat/${gatherId}`} title='chat for this event' onClick={() => setActiveNav('#contact')} className={activeNav === '#contact' ? 'active nav-bar-link' : 'nav-bar-link'}><BiMessageSquareDetail /></Link>


    </div>




  )
}

export default Nav