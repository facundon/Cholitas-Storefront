import "./scss/index.scss";

import * as React from "react";

import Nav from "./Nav";

const Footer: React.FC = () => (
  <div className="footer" id="footer">
    <Nav />
    <div className="footer__mp container">
      <img
        src="https://imgmp.mlstatic.com/org-img/banners/ar/medios/online/785X40.jpg"
        title="Mercado Pago - Medios de pago"
        alt="Mercado Pago - Medios de pago"
      />
    </div>
  </div>
);

export default Footer;
