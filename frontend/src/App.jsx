import { Routes, Route } from 'react-router-dom'
import Player from './pages/player'
import Cadastro from './pages/cadastro'
import Login from './pages/login'
import Buscar from './pages/buscar'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/player" element={<Player />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buscar" element={<Buscar />} />
      </Routes>
    </div>
  )
}

export default App