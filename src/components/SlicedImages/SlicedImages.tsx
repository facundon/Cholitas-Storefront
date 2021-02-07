import React from "react";
import { Link } from "react-router-dom";
import "./scss/index.scss";

const SlicedImages = props =>
  props.children?.map(img =>
    img ? (
      <Link to={img?.url} key={img?.url}>
        <div className="image-wrapper">
          <img src={img?.src} alt={img?.header} />
          <h2>{img?.header}</h2>
        </div>
      </Link>
    ) : null
  );

export default SlicedImages;
