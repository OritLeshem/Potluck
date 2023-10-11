import React from 'react'
import { Routes, Route } from 'react-router'


import { AppHeader } from './cmps/app-header'
import { AppFooter } from './cmps/app-footer'
import { UserDetails } from './pages/user/user-details'
import { HomePage } from './pages/home-page'
import { Chat } from './pages/chat'
import { UserMsg } from './cmps/user-msg'
import Nav from './cmps/nav'
import { GatherItemListIndex } from './pages/gather/gather-item-list-index'
import { GatherIndex } from './pages/gather/gather-index'
import { GatherEdit } from './pages/gather/gather-edit'
import { GatherGuestListIndex } from './pages/gather/gather-guest-list-index'

export function RootCmp() {

    return (
        <div>
            <AppHeader />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/gather" element={<GatherIndex />} />

                    <Route path="/chat/:gatherId" element={<Chat />} />
                    <Route path="/list/:gatherId" element={<GatherItemListIndex />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="/edit" element={<GatherEdit />} />
                    <Route path="/edit/:gatherId" element={<GatherEdit />} />
                    <Route path="/guest/:gatherId" element={<GatherGuestListIndex />} />



                </Routes>
            </main>
            <AppFooter />
            <UserMsg />
            <Nav />
        </div>
    )
}


