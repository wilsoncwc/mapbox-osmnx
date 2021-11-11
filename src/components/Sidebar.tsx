import React, { FC } from 'react'
import {
  Box, FormControl, FormLabel, Radio, RadioGroup, Stack, useColorModeValue
} from '@chakra-ui/react'
import { TravelMode } from '../types'
import { DEFAULT_MODE } from '../constants'

interface SidebarProps {
    onModeChange?: (mode: TravelMode) => void
}

const Sidebar: FC<SidebarProps> = ({ onModeChange }) => {
  const travelOptions = Object.entries(TravelMode)
  const bg = useColorModeValue('gray.50', 'gray.900')
  return (
    <Box
      bg={bg}
      p={4}
      borderRadius={4}
    >
      <FormControl id="country">
        <FormLabel>
          Choose mode of travel
        </FormLabel>
        <RadioGroup defaultValue={DEFAULT_MODE} onChange={onModeChange}>
          <Stack spacing={4} direction="row">
            {travelOptions.map(([mode, value], index) => (
              <Radio key={index} value={value}>
                {mode}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default Sidebar
