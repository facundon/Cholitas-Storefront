import React, { useState } from "react"
import { Redirect } from "react-router-dom"
import "./scss/index.scss"


const SlicedImages = (props) => {
    const [redirect, setRedirect] = useState()

    const handleRedirect = (e) => {
        setRedirect(e.currentTarget.getAttribute("url"))
    }

    const slices = props.children?.map( img => (img ? (
            <React.Fragment key={img?.url}>
                <div className="image-wrapper" url={img?.url} onClick={handleRedirect}>
                    <img src={img?.src}/>
                    <h2>{img?.header}</h2>
                </div>
            </React.Fragment>) : null)
        )
    
    return(<>
            {redirect ?
                <Redirect push to={redirect} />
                : null}
            {slices}
        </>)
}

export default SlicedImages