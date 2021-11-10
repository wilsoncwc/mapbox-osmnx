import { Box } from '@chakra-ui/react'
import Mapbox from '../src/components/Mapbox'
import Sidebar from '../src/components/Sidebar'

function App() {
  return (
    <Box w='100%' h='100%'>
      <Box pos='absolute' p={4} float='left' zIndex={99}>
        <Sidebar />
      </Box>
      <Mapbox />
    </Box>
  )
}

export default App