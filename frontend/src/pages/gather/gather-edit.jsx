import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addGather } from '../../store/gather/gather.actions'
import { ImgUploader } from '../../cmps/img-uploader'
// import { gatherService } from '../../services/gather.service.local'
import { gatherService } from '../../services/gather.service'
import { userService } from '../../services/user.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

export function GatherEdit() {
    const navigate = useNavigate()
    const { gatherId } = useParams()
    const [gatherToEdit, setGatherToEdit] = useState(gatherService.getEmptyGather())
    const [imgToGather, setImgToEdit] = useState()
    const loginUser = userService.getLoggedinUser()

    useEffect(() => {
        if (!gatherId) return
        loadGather()
    }, [])

    const loadGather = async () => {
        const gather = await gatherService.getById(gatherId)
        setGatherToEdit(gather)
    }

    function onUploaded(data) {
        gatherToEdit.imgUrl.push(data)
        setImgToEdit((prevImg) => ({ ...prevImg, data }))
    }
    function resetForm() {
        setGatherToEdit(gatherService.getEmptyGather())
    }
    const onSaveGather = async (ev) => {
        ev.preventDefault()

        console.log('gatherToEdit', gatherToEdit)
        try {
            const savedGather = await addGather(gatherToEdit)
            showSuccessMsg(`Gather added (id: ${savedGather._id})`)
            if (!gatherId) resetForm() // Reset form only if it's not an edit operation
            navigate('/gather')
        } catch (err) {
            showErrorMsg('Cannot add gather')
        }
    }

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setGatherToEdit((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <section className="gather-edit">
            <h1>{gatherId ? 'Edit Gather' : 'Add Gather'}</h1>

            <form onSubmit={onSaveGather}>
                <label htmlFor="">Title</label>
                <input name="title" type="text" onChange={handleChange} value={gatherToEdit.title} />
                <label htmlFor="">Description</label>
                <input
                    name="description"
                    type="text"
                    onChange={handleChange}
                    value={gatherToEdit.description}
                />
                <label htmlFor="">Date</label>
                <input name="myDate" type="date" onChange={handleChange} value={gatherToEdit.myDate} />
                <label htmlFor="">Location</label>
                <input name="location" type="text" onChange={handleChange} value={gatherToEdit.location} />

                <button className="button-add">{gatherId ? 'Update' : 'Add'}</button>
            </form>
        </section>
    )
}