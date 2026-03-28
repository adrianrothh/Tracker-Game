import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do backend do Adrian
})

export default api