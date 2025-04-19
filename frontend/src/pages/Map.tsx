import React from 'react'
import MapView from '../components/MapView'

const Map: React.FC = () => {
  return (
    //if you just put this div and the map import on any page it should work
    <div style={{ padding: '20px' }}>
      <h2>Here's your location!</h2>
      <MapView />
    </div>
  )
}

export default Map