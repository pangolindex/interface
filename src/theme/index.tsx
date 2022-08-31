import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { BetaColors, Colors } from './styled'

export * from './components'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

const philippineYellow = '#FFC800' //primary
const mustardYellow = '#E1AA00'

const eerieBlack = '#1C1C1C'
const ghostWhite = '#F7F8FA'
const ghostWhite1 = '#FAF9FD'
const chineseBlack = '#111111'
const darkGunmetal = '#212427'
const platinum = '#E5E5E5'
const darkSilver = '#717171'
const venetianRed = '#CC1512'
const oceanBlue = '#18C145'
const quickSilver = '#A3A3A3'

// beta theme color

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',
    text6: darkMode ? '#111111' : '#EDEEF2',
    text7: darkMode ? '#e6e9ec' : '#000000',
    text8: darkMode ? '#707070' : '#565A69',
    text9: darkMode ? '#A3A3A3' : '#000000',
    text10: darkMode ? '#FAF9FD' : '#000000',
    text11: '#18C145',
    text12: '#E84142',
    text13: darkMode ? '#A3A3A3' : '#000000',
    text14: darkMode ? '#8C8D93' : '#000000',
    text15: darkMode ? '#FFC800' : '#000000',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#2C2F36' : '#F7F8FA',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bg6: darkMode ? '#1c1c1c' : '#F7F8FA',
    bg7: darkMode ? '#2C2D33' : '#F7F8FA',
    bg8: darkMode ? '#212427' : '#FFFFFF',
    bg9: darkMode ? '#ffffff' : '#000000',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    modalBG2: darkMode ? 'rgba(0,0,0,.8)' : 'rgba(0,0,0,0.8)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    primary1: darkMode ? '#2172E5' : '#FF6B00',
    primary2: darkMode ? '#3680E7' : '#FF6B00',
    primary3: darkMode ? '#4D8FEA' : '#FF6B00',
    primary4: darkMode ? '#376bad70' : '#FF6B00',
    primary5: darkMode ? '#153d6f70' : '#FF6B00',
    primary6: darkMode ? '#2172E5' : '#FFFFFF',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#ffffff',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    red3: '#E84142',
    red3Gradient: 'rgba(232, 65, 66, 0.3)',
    green1: '#27AE60',
    green2: '#18C145',
    green2Gradient: ' rgba(24, 193, 69, 0.3)',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    yellow3: '#FFC800',
    orange1: '#E6E9EC',
    blue1: '#2172E5',

    avaxRed: '#E84142',

    // beta theme color
    color11: '#E67826',
    color22: '#707070',
    color33: '#FF6B00',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',

    primary: philippineYellow,
    mustardYellow,
    eerieBlack,
    ghostWhite,
    ghostWhite1,
    chineseBlack,
    darkGunmetal,
    platinum,
    darkSilver,
    venetianRed,
    oceanBlue,
    quickSilver,
    error: venetianRed,

    color2: darkMode ? chineseBlack : ghostWhite,
    color3: darkMode ? eerieBlack : platinum,
    color4: darkMode ? ghostWhite1 : chineseBlack,
    color5: darkMode ? darkGunmetal : white,
    color6: darkMode ? white : chineseBlack,
    color7: darkMode ? darkGunmetal : ghostWhite,
    color8: darkMode ? chineseBlack : platinum,
    color9: darkMode ? darkSilver : quickSilver,
    color10: darkMode ? eerieBlack : white,
    color12: darkMode ? darkSilver : platinum
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export function betaColors(darkMode: boolean): BetaColors {
  return {
    ...colors(darkMode),

    // text
    text7: darkMode ? '#e6e9ec' : '#000000',
    text8: darkMode ? '#707070' : '#565A69',
    text9: '#282828',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#111111' : '#F7F8FA',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bg6: darkMode ? '#1c1c1c' : '#FFFFFF',
    bg7: darkMode ? '#2C2D33' : '#FFFFFF',
    bg8: darkMode ? '#212427' : '#FFFFFF',

    //primary colors
    primary1: '#ffc800',
    primary2: '#FF6B00',
    primary3: '#FF6B00',
    primary4: '#FF6B00',
    primary5: '#FF6B00',
    primary6: darkMode ? '#FF6B00' : '#FFFFFF',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#ffffff',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    yellow2: '#FF6B00',

    swapWidget: {
      primary: darkMode ? white : black,
      secondary: darkMode ? darkSilver : quickSilver,
      backgroundColor: darkMode ? chineseBlack : ghostWhite,
      detailsBackground: darkMode ? black : white,
      interactiveColor: darkMode ? darkSilver : quickSilver,
      interactiveBgColor: darkMode ? darkGunmetal : ghostWhite
    },

    drawer: {
      text: darkMode ? white : black,
      backgroundColor: darkMode ? chineseBlack : ghostWhite
    },

    textInput: {
      text: darkMode ? darkSilver : quickSilver,
      labelText: darkMode ? darkSilver : quickSilver,
      placeholderText: darkMode ? darkSilver : quickSilver,
      backgroundColor: darkMode ? black : white
    },

    currencySelect: {
      defaultText: darkMode ? black : white,
      selectedText: darkMode ? white : black,
      defaultBackgroundColor: philippineYellow,
      selectedBackgroundColor: darkMode ? chineseBlack : ghostWhite
    },

    loader: {
      text: darkMode ? white : black
    },

    numberOptions: {
      text: darkMode ? white : black,
      activeTextColor: black,
      activeBackgroundColor: philippineYellow,
      inactiveBackgroundColor: darkMode ? chineseBlack : ghostWhite,
      borderColor: ghostWhite1
    },

    switch: {
      onColor: philippineYellow,
      offColor: '#CED0D9',
      backgroundColor: darkMode ? darkSilver : platinum
    },

    toggleButton: {
      backgroundColor: darkMode ? darkSilver : platinum,
      selectedColor: darkMode ? chineseBlack : ghostWhite,
      fontColor: darkMode ? platinum : chineseBlack
    },
    button: {
      primary: {
        background: philippineYellow,
        color: black
      },
      secondary: {
        background: chineseBlack,
        color: white
      },
      outline: {
        borderColor: philippineYellow,
        color: black
      },
      plain: {
        color: black
      },
      disable: {
        background: platinum,
        color: darkSilver
      },
      confirmed: {
        background: oceanBlue,
        color: oceanBlue,
        borderColor: oceanBlue
      }
    }
  }
}

export function betaThemeFn(darkMode: boolean): DefaultTheme {
  return {
    ...theme(darkMode),
    ...betaColors(darkMode)
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const betaThemeObject = useMemo(() => betaThemeFn(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={betaThemeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Poppins', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Poppins', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 14px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  
}

@keyframes spinners-react-dotted-shrink {
  50% {
    transform: translate(0, 0);
    opacity: 0;
  }
}

`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: unset;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: 'unset';
  background-color:  ${({ theme }) => theme.bg6}
}
`
