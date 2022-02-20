import React from 'react'
import { PageWrapper, Ibridge, ChainSelect, Separator, MaxButton, WrapButton } from './styleds'
import { Text, Box, ToggleButtons, Button } from '@pangolindex/components'


const BridgeUI = () => {
    
    return (
        <PageWrapper>
            <Ibridge>
                <Box p={20}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
                            Cross Chain
                        </Text>
                        <ToggleButtons options={['Bridge', 'Swap']} />
                    </Box>
                    <Separator />
                    <Text fontSize={16} fontWeight={500} lineHeight="24px" color="text10">
                        From
                    </Text>
                    <ChainSelect></ChainSelect>
                    <Separator />
                    <Text fontSize={16} fontWeight={500} lineHeight="24px" color="text10">
                        Destination
                    </Text>
                    <ChainSelect></ChainSelect>
                    <Separator />
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Text fontSize={16} fontWeight={500} lineHeight="24px" color="text10">
                            Amount
                        </Text>
                        <WrapButton>
                            <MaxButton  width="20%">
                            25%
                            </MaxButton>
                            <MaxButton  width="20%">
                            50%
                            </MaxButton>
                            <MaxButton  width="20%">
                            75%
                            </MaxButton>
                            <MaxButton width="20%">
                            100%
                            </MaxButton>
                        </WrapButton>
                      </Box>
                    <ChainSelect>
                    </ChainSelect>
                    <Separator />
                    <Button variant="primary" color='white'>
                    <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>BRIDGE</span>
                    </Button>
                </Box>
            </Ibridge>
        </PageWrapper>
    )

}

export default BridgeUI