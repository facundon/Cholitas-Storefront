import "./scss/index.scss";

import * as React from "react";
import { Container, Content, Sidebar } from "rsuite";
import ReactSVG from "react-svg";
import SlicedImages, {
  Loader,
  PanelGroup,
  SocialMediaIcon,
} from "../../components";
import SewingMachine from "../../images/sewing-machine.svg";
import AutoSlider from "../../components/AutoSlider/AutoSlider";
import CardSet from "../../components/CardSet/CardSet";
import { SOCIAL_MEDIA } from "../../core/config";

import {
  ProductsList_products,
  ProductsList_categories,
  ProductsList_shop,
  ProductsList_shop_homepageCollection_backgroundImage,
} from "./gqlTypes/ProductsList";

import { structuredData } from "../../core/SEO/Homepage/structuredData";
import { generateProductUrl, generateCategoryUrl } from "../../core/utils";

const Page: React.FC<{
  loading: boolean;
  categories: ProductsList_categories;
  backgroundImage: ProductsList_shop_homepageCollection_backgroundImage;
  shop: ProductsList_shop;
  products: ProductsList_products;
  collections: any;
}> = ({ loading, categories, collections, shop, products }) => {
  const productsExist = () => {
    return products && products.edges && products.edges.length > 0;
  };

  const getProductUrl = producto =>
    generateProductUrl(producto.node.id, producto.node.name);

  const getCategoryUrl = cat => generateCategoryUrl(cat.node.id, cat.node.name);

  const getProductsImg = () => {
    const product_list = products?.edges.map(producto =>
      producto.node.metadata?.filter(pair => pair.key === "destacado").length >
      0
        ? {
            header: producto.node.name,
            src: producto.node.thumbnail.url,
            url: getProductUrl(producto),
          }
        : null
    );
    return product_list?.filter(elements => elements != null);
  };

  const getCategoriesImgs = () =>
    categories?.edges?.map(cat =>
      cat?.node.backgroundImage
        ? {
            header: cat.node.name,
            src: cat.node.backgroundImage.url,
            url: getCategoryUrl(cat),
          }
        : null
    );

  const getCollectionImgs = () =>
    collections?.edges?.map(col =>
      col?.node.backgroundImage
        ? {
            src: col.node.backgroundImage.url,
          }
        : null
    );

  return (
    <>
      <script className="structured-data-list" type="application/ld+json">
        {structuredData(shop)}
      </script>
      <div id="home-page__hero" className="home-page__hero">
        <AutoSlider>{getCollectionImgs()}</AutoSlider>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="home-page__categories">
          <SlicedImages>{getCategoriesImgs()}</SlicedImages>
        </div>
      )}

      <Container className="home-page__pedidos">
        <Sidebar>
          <ReactSVG path={SewingMachine} svgClassName="icon" />
        </Sidebar>
        <Content>
          <h2>
            Realizamos trabajos <span>a medida!</span>
          </h2>
          <h2>No dudes en consultar</h2>
        </Content>
        <Sidebar>
          <ReactSVG path={SewingMachine} svgClassName="icon" />
        </Sidebar>
      </Container>

      {productsExist() &&
        (loading && !products ? (
          <Loader />
        ) : (
          <>
            <div className="home-page__destacados">
              <CardSet header="Productos Destacados">
                {getProductsImg()}
              </CardSet>
            </div>
            <div className="footer__favicons container">
              {SOCIAL_MEDIA.map(medium => (
                <SocialMediaIcon medium={medium} key={medium.ariaLabel} />
              ))}
            </div>
            <div className="home-page__info">
              <PanelGroup />
            </div>
          </>
        ))}
    </>
  );
};

export default Page;
