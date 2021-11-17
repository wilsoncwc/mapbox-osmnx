import React, { FC } from 'react'
import {
  Button, FormControl, FormLabel, Radio, RadioGroup, Stack, useColorModeValue, VStack
} from '@chakra-ui/react'
import { TravelMode } from '../types'
import { DEFAULT_MODE } from '../constants'

interface SidebarProps {
    onModeChange?: (mode: TravelMode) => void;
    toggleRoad?: () => void;
    toggleIso?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onModeChange, toggleRoad, toggleIso }) => {
  const travelOptions = Object.entries(TravelMode)
  const bg = useColorModeValue('gray.50', 'gray.900')
  return (
    <VStack
      bg={bg}
      p={4}
      borderRadius={4}
      spacing={4}
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
      <Button onClick={toggleRoad} variant='outline' p='4'>
        Toggle Roads
      </Button>
      <Button onClick={toggleIso} variant='outline' p='4'>
        Toggle Travel Time
      </Button>
    </VStack>
  )
}

export default Sidebar
