import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password })
      const { token, data } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(data.user)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password, passwordConfirm) => {
    try {
      const response = await api.post('/users/signup', {
        name,
        email,
        password,
        passwordConfirm
      })
      const { token, data } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(data.user)
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Logged out successfully!')
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}