export type Fiat = { symbol: string, name: string, logo: string }

const FLAG_FOLDER = "/images/flags/round/"

export const USD: Fiat = {'symbol': 'USD', 'name': 'United States Dollar', 'logo': `${FLAG_FOLDER}us.svg`}
export const EUR: Fiat = {'symbol': 'EUR', 'name': 'Euro', 'logo': `${FLAG_FOLDER}eu.svg`}
export const GBP: Fiat = {'symbol': 'GBP', 'name': 'British Pound Sterling', 'logo': `${FLAG_FOLDER}uk.svg`}
export const AUD: Fiat = {'symbol': 'AUD', 'name': 'Australian Dollar', 'logo': `${FLAG_FOLDER}au.svg`}
export const CAD: Fiat = {'symbol': 'CAD', 'name': 'Canadian Dollar', 'logo': `${FLAG_FOLDER}ca.svg`}
export const NZD: Fiat = {'symbol': 'NZD', 'name': 'New Zealand Dollar', 'logo': `${FLAG_FOLDER}nz.svg`}
export const ARS: Fiat = {'symbol': 'ARS', 'name': 'Argentine Peso', 'logo': `${FLAG_FOLDER}ar.svg`}
export const BRL: Fiat = {'symbol': 'BRL', 'name': 'Brazilian Real', 'logo': `${FLAG_FOLDER}br.svg`}
export const CHF: Fiat = {'symbol': 'CHF', 'name': 'Swiss Franc', 'logo': `${FLAG_FOLDER}ch.svg`}
export const CLP: Fiat = {'symbol': 'CLP', 'name': 'Chilean Peso', 'logo': `${FLAG_FOLDER}cl.svg`}
export const COP: Fiat = {'symbol': 'COP', 'name': 'Colombian Peso', 'logo': `${FLAG_FOLDER}co.svg`}
export const CZK: Fiat = {'symbol': 'CZK', 'name': 'Czech Koruna', 'logo': `${FLAG_FOLDER}cz.svg`}
export const DKK: Fiat = {'symbol': 'DKK', 'name': 'Danish Krone', 'logo': `${FLAG_FOLDER}dk.svg`}
export const HKD: Fiat = {'symbol': 'HKD', 'name': 'Hong Kong Dollar', 'logo': `${FLAG_FOLDER}hk.svg`}
export const ILS: Fiat = {'symbol': 'ILS', 'name': 'Israeli New Shekel', 'logo': `${FLAG_FOLDER}il.svg`}
export const INR: Fiat = {'symbol': 'INR', 'name': 'Indian Rupee', 'logo': `${FLAG_FOLDER}in.svg`}
export const ISK: Fiat = {'symbol': 'ISK', 'name': 'Icelandic Krona', 'logo': `${FLAG_FOLDER}is.svg`}
export const JPY: Fiat = {'symbol': 'JPY', 'name': 'Japanese Yen', 'logo': `${FLAG_FOLDER}jp.svg`}
export const KRW: Fiat = {'symbol': 'KRW', 'name': 'South Korean Won', 'logo': `${FLAG_FOLDER}kr.svg`}
export const MXN: Fiat = {'symbol': 'MXN', 'name': 'Mexican Peso', 'logo': `${FLAG_FOLDER}mx.svg`}
export const MYR: Fiat = {'symbol': 'MYR', 'name': 'Malaysian Ringgit', 'logo': `${FLAG_FOLDER}my.svg`}
export const NOK: Fiat = {'symbol': 'NOK', 'name': 'Norwegian Krone', 'logo': `${FLAG_FOLDER}no.svg`}
export const PHP: Fiat = {'symbol': 'PHP', 'name': 'Philippine Peso', 'logo': `${FLAG_FOLDER}ph.svg`}
export const PLN: Fiat = {'symbol': 'PLN', 'name': 'Polish Zloty', 'logo': `${FLAG_FOLDER}pl.svg`}
export const SEK: Fiat = {'symbol': 'SEK', 'name': 'Swedish Krona', 'logo': `${FLAG_FOLDER}se.svg`}
export const SGD: Fiat = {'symbol': 'SGD', 'name': 'Singapore Dollar', 'logo': `${FLAG_FOLDER}sg.svg`}
export const THB: Fiat = {'symbol': 'THB', 'name': 'Thai Baht', 'logo': `${FLAG_FOLDER}th.svg`}
export const VND: Fiat = {'symbol': 'VND', 'name': 'Vietnamese Dong', 'logo': `${FLAG_FOLDER}vn.svg`}
export const ZAR: Fiat = {'symbol': 'ZAR', 'name': 'South African Rand', 'logo': `${FLAG_FOLDER}za.svg`}

const SUPPORTED_FIAT_CURRENCIES: Fiat[] = [USD,
  EUR,
  GBP,
  AUD,
  CAD,
  NZD,
  ARS,
  BRL,
  CHF,
  CLP,
  COP,
  CZK,
  DKK,
  HKD,
  ILS,
  INR,
  ISK,
  JPY,
  KRW,
  MXN,
  MYR,
  NOK,
  PHP,
  PLN,
  SEK,
  SGD,
  THB,
  VND,
  ZAR,]

export {SUPPORTED_FIAT_CURRENCIES, FLAG_FOLDER}