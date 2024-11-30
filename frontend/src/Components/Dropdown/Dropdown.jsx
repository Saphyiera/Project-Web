import React from 'react'
import './Dropdown.css'

function Dropdown({ title, list, handleDropdown }) {
  return (
    <div className="box-input__dropdown">
        <div className="dropdown">
        {
            list.length ?
            list.map((item, index) => {
                return (
                    <div 
                    key={index}
                    onClick={() => handleDropdown(item.id, item.name)}
                    className="dropdown__item"
                    >
                    <span>{item.name}</span>
                    </div>
                )
            }) :
            <div className="dropdown__empty">
                {`Không tìm thấy ${title}`}
            </div>
        }
        </div>
    </div>
  )
}

export default Dropdown