import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  text6: Color
  text7: Color
  text8: Color
  text9: Color
  text10: Color
  text11: Color
  text12: Color
  text13: Color
  text14: Color
  text15: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bg8: Color
  bg9: Color

  modalBG: Color
  modalBG2: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color
  primary6: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  red3Gradient: Color
  green1: Color
  green2: Color
  green2Gradient: Color
  yellow1: Color
  yellow2: Color
  yellow3: Color
  blue1: Color
  orange1: Color

  avaxRed: Color

  color11: Color
  color22: Color
  color33: Color

  primary: Color
  mustardYellow: Color
  eerieBlack: Color
  ghostWhite: Color
  ghostWhite1: Color
  chineseBlack: Color
  darkGunmetal: Color
  platinum: Color
  darkSilver: Color
  venetianRed: Color
  oceanBlue: Color
  quickSilver: Color
  error: Color

  color2: Color
  color3: Color
  color4: Color
  color5: color
  color6: color
  color7: Color
  color8: Color
  color9: Color
  color10: Color
  color12: Color
}

export interface BetaColors extends Colors {
  // theme color objects for components
  swapWidget?: {
    primary?: Color
    secondary?: Color
    backgroundColor?: Color
    detailsBackground?: Color
    interactiveColor?: Color
    interactiveBgColor: Color
  }

  drawer?: {
    text?: Color
    backgroundColor?: Color
  }

  textInput?: {
    text?: Color
    labelText?: Color
    placeholderText?: Color
    backgroundColor?: Color
  }

  currencySelect?: {
    defaultText?: Color
    selectedText?: Color
    defaultBackgroundColor?: Color
    selectedBackgroundColor?: Color
  }

  loader?: {
    text?: Color
  }

  numberOptions?: {
    text: Color
    activeTextColor: Color
    activeBackgroundColor?: Color
    inactiveBackgroundColor?: Color
    borderColor?: Color
  }

  switch?: {
    onColor: Color
    offColor: Color
    backgroundColor: Color
  }
  toggleButton?: {
    backgroundColor?: Color
    selectedColor?: Color
    fontColor?: Color
  }
  button?: {
    primary?: {
      background?: Color
      color?: Color
    }
    secondary?: {
      background?: Color
      color?: Color
    }
    outline?: {
      borderColor?: Color
      color?: Color
    }
    plain?: {
      color?: Color
    }
    disable?: {
      background?: Color
      color?: Color
    }
    confirmed?: {
      background?: Color
      color?: Color
      borderColor?: Color
    }
  }
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors, BetaColors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
