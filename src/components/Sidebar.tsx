import React, { FC } from 'react'
import {
  Box, FormControl, FormLabel, Radio, RadioGroup, Stack
} from '@chakra-ui/react'
import { TravelMode } from '../types'

interface SidebarProps {
    mode?: string,
    onModeChange?: () => void
}

const Sidebar: FC<SidebarProps> = ({ mode, onModeChange }) => {
  const travelOptions = Object.keys(TravelMode)
  return (
    <Box
      bg="gray.50"
      p={4}
    >
      <FormControl id="country">
        <FormLabel>
          Choose mode of travel
        </FormLabel>
        <RadioGroup defaultValue="1">
          <Stack spacing={4} direction="row">
            {travelOptions.map(mode => (
              <Radio key={mode} value={mode}>
              mode
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default Sidebar