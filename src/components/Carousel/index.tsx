import NukaCarousel, { CarouselProps } from "nuka-carousel";
import * as React from "react";
import { useState } from "react";
import Media from "react-media";
import ReactSVG from "react-svg";
import Viewer from "react-viewer";

import arrowImg from "../../images/carousel-arrow.svg";
import {
  mediumScreen,
  smallScreen,
} from "../../globalStyles/scss/variables.scss";
import "./scss/index.scss";

interface CarouselType extends CarouselProps {
  children: React.ReactNode;
}

const Carousel: React.FC<CarouselType> = ({ children, ...rest }) => {
  const [visible, setVisible] = useState(false);
  const settings = {
    className: "carousel",
    renderBottomCenterControls: () => null,
    renderCenterLeftControls: ({ previousSlide, currentSlide }) =>
      currentSlide !== 0 ? (
        <div
          onClick={previousSlide}
          className="carousel__control carousel__control--left"
        >
          <ReactSVG path={arrowImg} />
        </div>
      ) : null,
    renderCenterRightControls: ({
      nextSlide,
      currentSlide,
      slideCount,
      slidesToShow,
    }) =>
      slideCount - slidesToShow !== currentSlide ? (
        <div
          onClick={nextSlide}
          className="carousel__control carousel__control--right"
        >
          <ReactSVG path={arrowImg} />
        </div>
      ) : null,
    ...rest,
  };
  const carousel = (slides: number) => (
    <>
      <div className="carousel-wrapper" onClick={() => setVisible(true)}>
        <NukaCarousel
          slidesToShow={slides}
          slidesToScroll={slides}
          {...settings}
        >
          {children}
        </NukaCarousel>
      </div>
      <Viewer
        visible={visible}
        noImgDetails
        maxScale={2}
        minScale={0.8}
        drag
        scalable={false}
        rotatable={false}
        attribute={false}
        onClose={() => {
          setVisible(false);
        }}
        images={children?.map(img => ({
          src: img?.props.url,
          alt: img?.props.url,
        }))}
      />
    </>
  );

  return (
    <Media query={{ maxWidth: smallScreen }}>
      {matches =>
        matches ? (
          carousel(1)
        ) : (
          <Media query={{ maxWidth: mediumScreen }}>
            {matches => carousel(matches ? 2 : 4)}
          </Media>
        )
      }
    </Media>
  );
};

export default Carousel;
