import { Routes, Route } from 'react-router-dom'
import Player from './pages/player'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </div>
  )
}

export default App