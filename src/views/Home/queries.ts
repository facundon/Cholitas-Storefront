import gql from "graphql-tag";

import { TypedQuery } from "../../core/queries";
import { ProductsList } from "./gqlTypes/ProductsList";

export const homePageQuery = gql`
  query ProductsList {
    shop {
      description
      name
      homepageCollection {
        id
        backgroundImage {
          url
        }
        name
      }
    }
    categories(level: 0, first: 9) {
      edges {
        node {
          id
          name
          backgroundImage(size: 600) {
            url
          }
        }
      }
    }
    products(first: 100) {
      edges {
        node {
          id
          name
          thumbnail(size: 510) {
            url
          }
          metadata {
            key
            value
          }
        }
      }
    }
    collections(first: 5) {
      edges {
        node {
          backgroundImage {
            url
          }
        }
      }
    }
  }
`;

export const TypedHomePageQuery = TypedQuery<ProductsList, {}>(homePageQuery);
