import React, { Component } from "react";
import { Panel } from "rsuite";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./CardSet.scss";
import { Redirect } from "react-router-dom";

// One item component
// selected prop will be passed
const Card = ({ src, selected }) => (
  <div className={`menu-item ${selected ? "active" : ""}`}>
    <Panel
      className="menu-item-panel"
      shaded
      bordered
      bodyFill
    >
      <img src={src}/>
      {/* <Panel header={header}>
        <p>
          <small>{header}</small>
        </p>
      </Panel> */}
    </Panel>
  </div>
);

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
  list.map(el => {
    const { header, src, url } = el;

    return (
      <Card
        key={header}
        selected={selected}
        src={src}
        url={url}
      />
    );
  });

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

const selected = null;

class CardSet extends Component {
  constructor(props) {
    super(props);
    // call it again if items count changes
    this.menuItems = Menu(this.props.children, selected);
  }
  state = { selected, redirect: false };

  onSelect = key => {
    this.setState({ selected: key, redirect: true });
  };

  render() {
    const { selected } = this.state;
    // Create menu from items
    const menu = this.menuItems;
    const selected_obj = this.menuItems.find(item => item.key === selected);
    return (
      <React.Fragment>
        {this.state.redirect ? (
          <Redirect push to={selected_obj.props.url} />
        ) : null}
        <h3>{this.props.header}</h3>
        <div className="scroll-menu">
          <ScrollMenu
            data={menu}
            transition="1"
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            alignCenter={false}
            selected={selected}
            onSelect={this.onSelect}
            wheel={false}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default CardSet;
