import React, { useContext, useRef } from 'react'
import Slider, { Settings } from 'react-slick'
import { ArrowLeft, ArrowRight } from 'react-feather'
import ReactMarkdown from 'react-markdown'
import { Box } from '@pangolindex/components'
import Scrollbars from 'react-custom-scrollbars'
import { ThemeContext } from 'styled-components'

import { News, useGetNews } from 'src/state/news/hooks'

import Earth from 'src/assets/images/earth.png'
import { NewsSection, NewsTitle, NewsContent, NewsDate, SlickNext } from './styleds'
import Loader from 'src/components/Loader'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'


const NewsFeedSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  autoplaySpeed: 10000
}

export default function NewsWidget() {
  const theme = useContext(ThemeContext)
  const sliderRef = useRef<Slider | null>(null)
  const handleNewsNext = () => {
    sliderRef?.current?.slickNext()
  }
  const handleNewsBack = () => {
    sliderRef?.current?.slickPrev()
  }
  const news = useGetNews()

  return (
    <NewsSection img={Earth}>
      <Box height="15%" display="flex">
        <NewsTitle>News</NewsTitle>
        <SlickNext onClick={handleNewsBack} style={{ right: 60 }}>
          <ArrowLeft size={20} style={{ minWidth: 24 }} />
        </SlickNext>
        <SlickNext onClick={handleNewsNext}>
          <ArrowRight size={20} style={{ minWidth: 24 }} />
        </SlickNext>
      </Box>
      <Box height="90%" paddingTop="10px">
      {!!news ? (
        <Slider ref={sliderRef} {...NewsFeedSettings}>
          {news &&
            news.map((element: News) => (
              <div key={element.id} style={{ height: '100%' }}>
                <NewsContent>
                  <Scrollbars style={{ height: '100%', padding: "0px 10px"}}>
                    <ReactMarkdown
                      renderers={{
                        link: props => (
                          <a href={props.href} rel="nofollow noreferrer noopener" target="_blank">
                            {props.children}
                          </a>
                        )
                      }}
                    >
                      {element.content}
                    </ReactMarkdown>
                  </Scrollbars>
                </NewsContent>
                <NewsDate>
                  {element?.publishedAt.toLocaleTimeString()}, {element?.publishedAt.toLocaleDateString()}
                </NewsDate>
              </div>
            ))}
        </Slider>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Loader
            size="10%"
            stroke={theme.yellow3}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block'
            }}
          />
        </Box>
      )}
      </Box>
    </NewsSection>
  )
}
