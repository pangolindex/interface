import styled from 'styled-components'

export const AnalyticsLink = styled.a`
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;

    svg {
        height: 16px;
    }

    path { 
        fill: ${({ theme }) => theme.text1};
    }

    &:hover, &focus {
        path { 
            fill: ${({ theme }) => theme.yellow1};
        }
    }
`
