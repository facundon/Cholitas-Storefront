import React from "react"
import { Panel, PanelGroup, Icon } from "rsuite"
import { INFORMATION } from "../../core/config"
import "./scss/index.scss";

const PanelSet = () => {
    const panel = (header, icon, info, index) => {
        return (
            <Panel 
                header={<>
                            <Icon 
                                    style={icon.flip ? {paddingLeft: "8px"} : {paddingRight: "8px"}} 
                                    icon={icon.icon} 
                                    size={icon.size} 
                                    flip={icon.flip ? "horizontal" : null}
                            /> 
                            <h4>{header}</h4>
                        </>}
                eventKey={index}
                key={index}
            >
                <p>{info.line1}</p>
                <p>{info.line2}</p>
            </Panel>
        )
    }
    
 return (
    <div className="panel-container">
        <PanelGroup accordion classPrefix="panel-group container">
            {INFORMATION.map(
                (d, index) => panel(d.header, d.icon, d.info, index)
            )}
        </PanelGroup>
    </div>
 )
}

export default PanelSet