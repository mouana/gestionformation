import React, { useState } from 'react'

function Login() {
    const [email, setEmail] = useState('esteban.schiller@gmail.com');
    const [password, setPassword] = useState('');
    const [rememberPassword, setRememberPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };
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
                    
                    <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email address:</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <a href="#" className="text-sm text-[#285793] hover:underline">Forget Password?</a>
                        </div>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6 flex items-center">
                        <input 
                            type="checkbox" 
                            id="remember"
                            checked={rememberPassword}
                            onChange={(e) => setRememberPassword(e.target.checked)}
                            className="mr-2 rounded text-[#285793] focus:ring-blue-500"
                        />
                        <label htmlFor="remember" className="text-gray-700">Remember Password</label>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-[#285793] text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Sign In
                    </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
