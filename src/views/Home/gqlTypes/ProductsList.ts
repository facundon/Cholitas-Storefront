/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProductsList
// ====================================================

export interface ProductsList_shop_homepageCollection_backgroundImage {
  __typename: "Image";
  /**
   * The URL of the image.
   */
  url: string;
}

export interface ProductsList_shop_homepageCollection {
  __typename: "Collection";
  /**
   * The ID of the object.
   */
  id: string;
  backgroundImage: ProductsList_shop_homepageCollection_backgroundImage | null;
  name: string;
}

export interface ProductsList_shop {
  __typename: "Shop";
  /**
   * Shop's description.
   */
  description: string | null;
  /**
   * Shop's name.
   */
  name: string;
  /**
   * Collection displayed on homepage.
   */
  homepageCollection: ProductsList_shop_homepageCollection | null;
}

export interface ProductsList_categories_edges_node_backgroundImage {
  __typename: "Image";
  /**
   * The URL of the image.
   */
  url: string;
}

export interface ProductsList_products_edges_node_metadata {
  [x: string]: any;
  __typename: "MetadataItem";

  key: string;
  value: string;
}

export interface ProductsList_categories_edges_node {
  __typename: "Category";
  /**
   * The ID of the object.
   */
  id: string;
  name: string;
  backgroundImage: ProductsList_categories_edges_node_backgroundImage | null;
}

export interface ProductsList_categories_edges {
  __typename: "CategoryCountableEdge";
  /**
   * The item at the end of the edge.
   */
  node: ProductsList_categories_edges_node;
}

export interface ProductsList_categories {
  __typename: "CategoryCountableConnection";
  edges: ProductsList_categories_edges[];
}

export interface ProductsList {
  /**
   * Return information about the shop.
   */
  shop: ProductsList_shop;
  /**
   * List of the shop's categories.
   */
  categories: ProductsList_categories | null;
  products: ProductsList_products | null;
}

export interface  ProductsList_products{
  __typename: "ProductCountableConnection";
  edges: ProductsList_products_edges[];
}

export interface ProductsList_products_edges {
  __typename: "ProductCountableEdge";
  /**
   * The item at the end of the edge.
   */
  node: ProductsList_products_edges_node;
}

export interface ProductsList_products_edges_node{ 
  __typename: "Product";
  /**
   * The ID of the object.
   */
  name: string;
  thumbnail: ProductsList_products_edges_node_thumbnail | null;
  metadata: ProductsList_products_edges_node_metadata | null;
}

export interface ProductsList_products_edges_node_thumbnail {
  __typename: "Image";
  /**
   * The URL of the image.
   */
  url: string;
}
