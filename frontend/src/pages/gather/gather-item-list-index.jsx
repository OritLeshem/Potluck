import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addItemToGather,
    loadGather,
    loadGathers,
    removeItem,
    updateItemToGather,
} from '../../store/gather/gather.actions';
import { SOCKET_EMIT_GATHER_TOPIC_ITEM, SOCKET_EMIT_NEW_ITEM, SOCKET_EMIT_SEND_ITEM, socketService } from '../../services/socket.service-copy';

import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js';
import { useParams } from 'react-router-dom';
// import { gatherService } from '../../services/gather.service.local';
import { gatherService } from '../../services/gather.service';


export function GatherItemListIndex() {
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState([]);
    const user = useSelector(storeState => storeState.userModule.user);
    const [itemToEdit, setItemToEdit] = useState({ _id: '', item: '', isDone: false, itemOnwer: '' });
    const dispatch = useDispatch()

    const gather = useSelector(storeState => storeState.gatherModule.gather);
    const { gatherId } = useParams();
    const inputRef = useRef(null); // Ref for the input element

    useEffect(() => {
        // Join room
        gather && socketService.emit(SOCKET_EMIT_GATHER_TOPIC_ITEM, gather);

        // Add a listener for new items
        gather && socketService.on(SOCKET_EMIT_NEW_ITEM, newItem => {
            setItems(prevItems => [...prevItems, newItem]);
        });

        // Remove the listener on unmount
        return () => {
            gather && socketService.off(SOCKET_EMIT_NEW_ITEM);
        };
    }, []);


    useEffect(() => {
        // loadGathers();
        onLoadGather(gatherId);
    }, [gatherId]);
    // useEffect(() => {
    //     if (gather) {
    //         setItems(previtems => [...previtems, itemToEdit]);
    //     }
    // }, [items]);
    async function onLoadGather(gatherId) {
        try {
            await loadGather(gatherId);
            showSuccessMsg('Gather set');
        } catch (err) {
            showErrorMsg('Cannot set gather');
        }
    }

    useEffect(() => {
        if (gather) {
            setItems(gather.itemToBring);
        }
    }, [gather]);

    useEffect(() => {
        // Set the cursor position at the end of the input when editing
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
    }, [isEditing]);

    function onRemoveItem(gatherId, itemId) {
        removeItem(gatherId, itemId);
        showSuccessMsg('itemId removed');
    }
    async function handleChange({ target }, item) {
        const { value, type, name: field, checked } = target;
        if (type === 'checkbox') {
            // if (user?._id !== item?.itemOnwer._id) return
            if (item.isDone && item?.itemOnwer._id !== user?._id) {
                showErrorMsg('this item is already checked by another guest')
                return

            }

            try {
                await updateItemToGather(gatherId, { ...item, isDone: checked, itemOnwer: user });

                // Update the items array to reflect the updated isDone value
                setItems(prevItems => {
                    return prevItems.map(prevItem => {
                        if (prevItem._id === item._id) {
                            return { ...prevItem, isDone: checked };
                        }
                        return prevItem;
                    })
                })
                console.log("gatherId", gatherId)

            } catch (err) {
                console.log(err);
            }
        } else {
            setItemToEdit(prev => ({ ...prev, [field]: value }));
        }
    }


    function _makeId(length = 5) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }



    function onUpdateItem(gatherId, item) {
        setIsEditing(true);
        setItemToEdit(item);
    }
    async function onSaveItem() {
        if (itemToEdit.item.trim() === "") {
            showErrorMsg("Item title cannot be empty");
            return;
        }

        if (!isEditing) {
            // Handle saving a new item
            const existingItem = gather.itemToBring.find(
                (checkItem) => checkItem.item === itemToEdit.item
            );
            if (existingItem) {
                showErrorMsg("This item is already in this gather");
                return;
            }

            try {
                itemToEdit._id = _makeId()
                itemToEdit.itemOnwer = user
                if (user) itemToEdit.itemOnwer = user
                socketService.emit(SOCKET_EMIT_NEW_ITEM, itemToEdit);

                const savedGather = await addItemToGather(gatherId, itemToEdit);
                showSuccessMsg(`Item "${itemToEdit.item}" added to gather "${gatherId}"`);
                setItemToEdit({ _id: "", item: "", isDone: false, itemOwner: user });
            } catch (err) {
                showErrorMsg(
                    `Cannot add item "${itemToEdit.item}" to gather "${gatherId}": ${err}`
                );
            }
        } else {
            // Handle updating an existing item
            try {

                const updatedGather = await updateItemToGather(gatherId, itemToEdit);
                showSuccessMsg(
                    `Item "${itemToEdit.item}" updated in gather "${gatherId}"`
                );
                setItemToEdit({ _id: "", item: "", isDone: false, itemOwner: user });
                setIsEditing(false);
            } catch (err) {
                showErrorMsg(
                    `Cannot update item "${itemToEdit.item}" in gather "${gatherId}": ${err}`
                );
            }
        }
    }

    return (
        <div className='gather-item-list-index'>
            {gather ? (
                <main>
                    <h3>{gather.title}</h3>
                    <table >
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Checkbox</th>
                                <th>Guest</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gather.itemToBring.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        {itemToEdit._id === item._id ? (
                                            <input
                                                name="item"
                                                type="text"
                                                onChange={handleChange}
                                                value={itemToEdit.item}
                                                className={itemToEdit._id === item._id ? "edit-input" : ""}

                                            />
                                        ) : (
                                            item.item
                                        )}
                                    </td>
                                    <td>
                                        {/* <label>{item.itemOnwer._id}</label> */}
                                        <input
                                            name="isDone"
                                            type="checkbox"
                                            onChange={(e) => handleChange(e, item)}
                                            checked={item.isDone}
                                        />
                                    </td>
                                    <td>
                                        {item.isDone ? (item.itemOnwer && item.itemOnwer.imgUrl ?
                                            <img className='item-owner-img' src={item.itemOnwer.imgUrl} alt="" />
                                            : item.itemOnwer?.fullname) : ''}
                                    </td>
                                    <td>
                                        {itemToEdit._id === item._id ? (
                                            <>
                                                <button className="button-add" onClick={onSaveItem}>
                                                    Save
                                                </button>
                                                <button
                                                    className="button-list fa-regular trash-can"
                                                    onClick={() => onRemoveItem(gatherId, item._id)}
                                                ></button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="button-list fa-solid pen-to-square"
                                                    onClick={() => onUpdateItem(gatherId, item)}
                                                ></button>
                                                <button
                                                    className="button-list fa-regular trash-can"
                                                    onClick={() => onRemoveItem(gatherId, item._id)}
                                                ></button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <input
                                        id="item"
                                        name="item"
                                        type="text"
                                        onChange={handleChange}
                                        value={itemToEdit.item}
                                        className='add-item'
                                        placeholder='Add a new item'
                                    />
                                </td>
                                <td></td> {/* Empty cell for Checkbox column */}
                                <td></td> {/* Empty cell for user column */}
                                <td>



                                    <button className="button-add-item" onClick={onSaveItem}>Add</button>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </main>
            ) : (
                <p>Loading gather...</p>
            )}
        </div>
    );
}