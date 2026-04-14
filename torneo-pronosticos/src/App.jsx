import './Styles/App.css'
import { Routes,Route } from 'react-router-dom'
import Login from './Pages/Login'
import TablaPosiciones from './Pages/TablaPosiciones';
import Jornadas from './Pages/Jornadas';
import FormPartidos from './Pages/FormPartidos';
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
 return(
  <Routes>
    <Route path='/' element={<Login/>}/>

    <Route path='/tabla' 
    element={
      <ProtectedRoute>
        <TablaPosiciones/>
      </ProtectedRoute>}
    />
    <Route path='/jornadas' 
    element={
      <ProtectedRoute>
        <Jornadas/>
      </ProtectedRoute>}
    />
    <Route path='/formulario' 
    element={
      <ProtectedRoute requireAdmin={true}>
        <FormPartidos/>
      </ProtectedRoute>}
    />
  </Routes>
 )
}

export default App
