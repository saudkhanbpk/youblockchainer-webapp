import React from 'react'
import './Loading.css'
function Loading() {
    return (
        <div className="gooey">
            <span className="dot"></span>
            <div className="dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )
}

export default Loading