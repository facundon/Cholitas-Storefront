import React from "react";
import { Panel, PanelGroup, Icon } from "rsuite";
import { INFORMATION } from "../../core/config";
import "./scss/index.scss";

const PanelSet = () => {
  const getParagraph = data => {
    return data?.map(d => {
      const data_arr = d.info?.split(" ");
      const placeholders = d.info?.match(/\$(.*?)\$/g);
      placeholders?.forEach(placeholder => {
        const text = placeholder.substring(1, placeholder.length - 1);
        const element = React.createElement("span", {}, text);
        const index = data_arr.indexOf(placeholder);
        data_arr[index] = element;
      });
      return (
        <p key={d.info} className="content">
          <Icon size="lg" icon={d.icon} />
          {data_arr?.map((item, index) => (
            <React.Fragment key={index * 100}>{item} </React.Fragment>
          ))}
        </p>
      );
    });
  };

  const getContent = (header, data) => {
    switch (header) {
      case "Contacto":
        return (
          <>
            <p className="sub-header">
              Cualquier inquietud no dudes en contactarnos por estos medios
            </p>
            {getParagraph(data)}
          </>
        );
      default:
        return <>{getParagraph(data)}</>;
    }
  };

  const panel = (header, icon, data, index) => {
    return (
      <Panel
        header={
          <h3>
            <Icon
              style={
                icon.flip ? { paddingLeft: "10px" } : { paddingRight: "10px" }
              }
              icon={icon.icon}
              size={icon.size}
              flip={icon.flip ? "horizontal" : null}
            />
            {header}
          </h3>
        }
        eventKey={index}
        key={index}
      >
        {getContent(header, data)}
      </Panel>
    );
  };

  return (
    <div className="panel-container">
      <PanelGroup accordion classPrefix="panel-group container">
        {INFORMATION.map((info, index) =>
          panel(info.header, info.icon, info.data, index)
        )}
      </PanelGroup>
    </div>
  );
};

export default PanelSet;
