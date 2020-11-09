import "./scss/index.scss";

import * as React from "react";

import { Loader } from "../../components";

import AutoSlider from "../../components/AutoSlider/AutoSlider";
import CardSet from "../../components/CardSet/CardSet";

import {
  ProductsList_products,
  ProductsList_categories,
  ProductsList_shop,
  ProductsList_shop_homepageCollection_backgroundImage,
} from "./gqlTypes/ProductsList";

import { structuredData } from "../../core/SEO/Homepage/structuredData";
import { generateProductUrl } from "../../core/utils";


const Page: React.FC<{
  loading: boolean;
  categories: ProductsList_categories;
  backgroundImage: ProductsList_shop_homepageCollection_backgroundImage;
  shop: ProductsList_shop;
  products: ProductsList_products;
}> = ({ loading, categories, backgroundImage, shop, products }) => {
  const productsExist = () => {
    return products && products.edges && products.edges.length > 0;
  };

  const getProductUrl = producto =>
    generateProductUrl(producto.node.id, producto.node.name);

  const getProductsImg = () => {
    return products.edges.map(producto => ({
      header: producto.node.name,
      src: producto.node.thumbnail.url,
      url: getProductUrl(producto),
    }));
  };

  const getCategoriesImgs = () =>
   categories.edges.map(cat =>
     cat.node.backgroundImage ? cat.node.backgroundImage.url : null
   );

  return (
    <>
      <script className="structured-data-list" type="application/ld+json">
        {structuredData(shop)}
      </script>
      <div className="home-page__hero">
        <AutoSlider>{getCategoriesImgs()}</AutoSlider>
      </div>
      {productsExist() &&
        (loading && !products ? (
          <Loader />
        ) : (
          <div className="home-page__destacados">
            <CardSet header="Productos Destacados">{getProductsImg()}</CardSet>
          </div>
        ))}
    </>
  );
};

export default Page;
