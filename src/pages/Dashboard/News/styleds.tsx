import { Box } from '@pangolindex/components'
import styled from 'styled-components'

// news section
export const NewsSection = styled(Box)<{ img: string }>`
  position: relative;
  background-color: ${({ theme }) => theme.bg2};
  background-image: url(${props => props.img});
  background-repeat: no-repeat;
  background-position: bottom right;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  & .slick-slider {
    height: 100%
    padding: 0 20px 0px;

    .slick-dots {
      bottom: 0px;
      li button:before{
        color: ${({ theme }) => theme.text1};
      }
      li.slick-active button:before{
        color: ${({ theme }) => theme.text1};
      }
      
    }
  }

  & .slick-slide {
    height: auto;

    & div {
      height: 100%;
    }
  }

  & .slick-list {
    height: 100%;
  }

  & .slick-track {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    height: 100%;
  }
`

export const NewsTitle = styled(Box)`
  position: absolute;
  top: 0px;
  left: 0px;
  font-weight: bold;
  font-size: 32px;
  line-height: 48px;
  padding: 20px;
  background: linear-gradient(0deg, #ffc800, #ffc800);
  border-radius: 5px 0px 5px 0px;
`

export const NewsContent = styled(Box)`
  color: ${({ theme }) => theme.text7};
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  height: 90% !important;
  & a {
    color: ${({ theme }) => theme.text7};
  }
`

export const NewsDate = styled(Box)`
  font-size: 10px;
  line-height: 15px;
  display: flex;
  align-items: center;
  color: #929292;
  margin-button: 15px;
  height: 10% !important;
  padding: 0px 10px;
`

export const SlickNext = styled(Box)<{ onClick: () => void }>`
  background: ${({ theme }) => theme.primary};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
  z-index: 9999;
`
