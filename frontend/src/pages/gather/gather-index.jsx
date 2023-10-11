import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadGathers, removeGather } from '../../store/gather/gather.actions'

import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { useNavigate } from 'react-router-dom'
import { GatherList } from '../../cmps/gather/gather-list'

export function GatherIndex() {
    const gathers = useSelector(storeState => storeState.gatherModule.gathers)
    const navigete = useNavigate()
    useEffect(() => {
        loadGathers()
    }, [])

    async function onRemoveGather(gatherId) {
        console.log('remove gather', gatherId)

        try {
            await removeGather(gatherId)
            showSuccessMsg('Gather removed')
        } catch (err) {
            showErrorMsg('Cannot remove gather')
        }
    }

    async function onAddGather() {
        navigete(`/edit`)
    }

    async function onUpdateGather(gather) {
        navigete(`/edit/${gather._id}`)
    }

    function onGuestList(gather) {
        navigete(`/guest/${gather._id}`)

    }
    return (
        <div className='home-page'>
            <h3>Your gathers!</h3>
            <main>
                <button onClick={onAddGather} className='fa-regular plus'> </button>
                <GatherList gathers={gathers} onUpdateGather={onUpdateGather} onRemoveGather={onRemoveGather} onGuestList={onGuestList} />

            </main>
        </div>
    )
}