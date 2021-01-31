import { media, styled } from "@styles";


export const Wrapper = styled.div`
  background: ${props => props.theme.colors.hoverLightBackground};
  padding: 1rem 2rem 1.6rem 2rem;
  text-align: center;  
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: 10px 10px 13px -12px;
  border-radius: 10px;
  display: inline-grid;
  align-content: space-between;
  grid-template-rows: 1fr 6fr 1fr;
  grid-gap: 0.5rem;

  :hover {
    background-color: ${props => props.theme.colors.secondaryOverlayDark};
    box-shadow: 9px 9px 6px -12px ${props => props.theme.colors.dark};
    color: ${props => props.theme.colors.secondaryDark}
  }

  ${media.largeScreen`
    padding: 0.8rem 1.5rem 1.1rem 1.5rem;
  `}

  ${media.smallScreen`
    padding: 0.5rem 1rem 0.7rem 1rem;
  `}
`;

export const Title = styled.h4`
  text-transform: uppercase;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 200;

  ${media.largeScreen`
    font-size: 0.8rem;
  `}
  ${media.smallScreen`
    font-size: 0.7rem;
  `}
`;

export const Price = styled.p`
  font-size: ${props => props.theme.typography.h3FontSize};
  text-align: left;
  align-self: end;
  font-weight: 600;

  ${media.largeScreen`
    font-size: 1.25rem;
  `}

  ${media.smallScreen`
    font-size: 1rem;
  `}
`;

export const Image = styled.div`
  height: auto;
  width: fit-content;
  justify-self: center;
  align-self: center;
  
  > img {
    width: auto;
    height: auto;
    max-width: 100%;
    object-fit:cover;

    ${media.largeScreen`
    `}

    ${media.smallScreen`
    `} 
  }
`;
