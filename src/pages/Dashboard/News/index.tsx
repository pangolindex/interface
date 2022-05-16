import React, { useContext, useRef } from 'react'
import Slider, { Settings } from 'react-slick'
import { ArrowLeft, ArrowRight } from 'react-feather'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box } from '@pangolindex/components'
import Scrollbars from 'react-custom-scrollbars'
import { ThemeContext } from 'styled-components'
import { CHAINS } from '@pangolindex/sdk'
import { News, useGetNews } from 'src/state/news/hooks'

import Earth from 'src/assets/images/earth.png'
import { NewsSection, NewsTitle, NewsContent, NewsDate, SlickNext } from './styleds'
import Loader from 'src/components/Loader'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useChainId } from 'src/hooks'

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
  const chainId = useChainId()
  const theme = useContext(ThemeContext)
  const sliderRef = useRef<Slider | null>(null)
  const handleNewsNext = () => {
    sliderRef?.current?.slickNext()
  }
  const handleNewsBack = () => {
    sliderRef?.current?.slickPrev()
  }
  const { data: news, isLoading } = useGetNews()

  return (
    <NewsSection img={Earth}>
      <Box height="20%" display="flex">
        <NewsTitle>News</NewsTitle>
        <SlickNext onClick={handleNewsBack} style={{ right: 60 }}>
          <ArrowLeft size={20} style={{ minWidth: 24 }} />
        </SlickNext>
        <SlickNext onClick={handleNewsNext}>
          <ArrowRight size={20} style={{ minWidth: 24 }} />
        </SlickNext>
      </Box>
      <Box height="80%" paddingTop={CHAINS[chainId].mainnet ? "10px" : "30px"}>
        {!isLoading ? (
          <Slider ref={sliderRef} {...NewsFeedSettings}>
            {news &&
              news.map((element: News) => (
                <div key={element.id} style={{ height: '100%' }}>
                  <NewsContent>
                    <Scrollbars
                      style={{ height: '100%', padding: '0px 10px' }}
                      // disable horizontal bar in content
                      // eslint-disable-next-line react/prop-types
                      renderView={props => <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />}
                      // vertical bar use theme color
                      renderThumbVertical={props => (
                        <div
                          {...props}
                          style={{
                            // eslint-disable-next-line react/prop-types
                            ...props.style,
                            backgroundColor: theme.text1,
                            opacity: 0.2,
                            cursor: 'pointer',
                            borderRadius: '3px'
                          }}
                        />
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        linkTarget={'_blank'}
                        components={{
                          /* eslint-disable react/prop-types */
                          a: ({ children, ...props }) => {
                            const linkProps = props
                            if (props.target === '_blank') {
                              linkProps['rel'] = 'noopener noreferrer'
                            }
                            return <a {...linkProps}>{children}</a>
                          }
                        }}
                      >
                        {element.content}
                      </ReactMarkdown>
                    </Scrollbars>
                  </NewsContent>
                  <NewsDate>
                    {element?.updatedAt
                      ? element?.updatedAt?.toLocaleTimeString()
                      : element?.createdAt.toLocaleTimeString()}
                    , {element.updatedAt ? element?.updatedAt?.toDateString() : element?.createdAt.toDateString()}
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
