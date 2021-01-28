import React, { Component } from "react";

import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/custom-animations/cube-animation.css";
import "./AutoSlider.scss";

const AutoplaySlider = withAutoplay(AwesomeSlider);

class AutoSlider extends Component {
  render() {
    const imgs = this.props.children?.map(img => <div key={img?.src} data-src={img?.src} />);

    return (
      <AutoplaySlider
        animation="cubeAnimation"
        play={true}
        cancelOnInteraction={false} // should stop playing on user interaction
        interval={6000}
      >
        {imgs}
      </AutoplaySlider>
    );
  }
}

export default AutoSlider;
