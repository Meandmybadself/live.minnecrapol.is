import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.body};
    color: ${({ theme }) => theme.colors.text};

    transition: all 0.25s linear;
    transition-property: background-color, color;
  }

  a:after {
    background-color: ${({ theme }) => theme.colors.text};
  }

  div[data-vjs-player="true"] {
    background-color: ${({ theme }) => theme.colors.body};
    box-shadow: ${({ theme }) => `0px 0px 20px 6px ${theme.colors.videoShadow}`};

    transition: box-shadow 0.25s linear;
  }
`

export default GlobalStyles