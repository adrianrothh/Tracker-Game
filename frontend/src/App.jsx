import { Routes, Route, Navigate } from 'react-router-dom'
import Player from './pages/player'
import Cadastro from './pages/cadastro'
import Login from './pages/login'
import Buscar from './pages/buscar'
import Home from './pages/home'
import { Navbar } from './components/navbar'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/player/:nome/:tag" element={<Player />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App