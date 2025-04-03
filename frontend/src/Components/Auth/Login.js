import React, { useState } from 'react'
import axios from 'axios'

function Login() {
    const [matrecule, setMatrecule] = useState('ADM12345')
    const [motdePasse, setMotdePasse] = useState('')
    const [remembermotdePasse, setRemembermotdePasse] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
    
        try {
            const formData = new FormData();
            formData.append('matrecule', matrecule);
            formData.append('motdePasse', motdePasse);
    
            const response = await axios.post('http://127.0.0.1:8000/api/login', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.data.token) {
                const { token,user } = response.data
                const data = response
                localStorage.setItem('token', token)
                // console.log(data)
                alert(`Login successful welcome , ${user.nom}`)
            } else {
                setError('Invalid credentials, please try again.')
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred during login. Please try again.')
        } finally {
            setLoading(false)
        }
    }
    

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
                <div 
                    className="absolute top-0 left-0 w-1/2 h-1/3 bg-[#285793] transform -rotate-12 origin-top-left" 
                    style={{
                        borderBottomRightRadius: '50%',
                        transform: 'rotate(-12deg) translate(-20%, -30%)'
                    }}></div>
                <div 
                    className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-[#285793] transform rotate-12 origin-bottom-right" 
                    style={{
                        borderTopLeftRadius: '50%',
                        transform: 'rotate(12deg) translate(20%, 30%)'
                    }}></div>

                <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-8 border">
                    <h2 className="text-2xl font-bold text-center mb-6">Login to Account</h2>
                    
                    {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="matrecule" className="block text-gray-700 mb-2">Matrecule</label>
                            <input 
                                type="matrecule" 
                                id="matrecule"
                                value={matrecule}
                                onChange={(e) => setMatrecule(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="motdePasse" className="block text-gray-700">Password</label>
                                <a href="#" className="text-sm text-[#285793] hover:underline">Forget Password?</a>
                            </div>
                            <input 
                                type="password" 
                                id="password"
                                value={motdePasse}
                                onChange={(e) => setMotdePasse(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-6 flex items-center">
                            <input 
                                type="checkbox" 
                                id="remember"
                                checked={remembermotdePasse}
                                onChange={(e) => setRemembermotdePasse(e.target.checked)}
                                className="mr-2 rounded text-[#285793] focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-gray-700">Remember Pasword</label>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-[#285793] text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
