import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginUserSuccess } from "../../app/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
    const [matrecule, setMatrecule] = useState("ADM12345");
    const [motdePasse, setMotdePasse] = useState("");
    const [remembermotdePasse, setRemembermotdePasse] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ matrecule, motdePasse }));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const userData = localStorage.getItem("user");

        // Parse only if userData is not undefined or null
        if (token && role && userData && userData !== "undefined" && !user) {
            try {
                const parsedUser = JSON.parse(userData);
                dispatch(loginUserSuccess({ token, role, user: parsedUser }));
            } catch (e) {
                console.error("Failed to parse userData from localStorage", e);
            }
        }

        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-8 border">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Account</h2>

                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="matrecule" className="block text-gray-700 mb-2">Matricule</label>
                        <input
                            type="text"
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
                            id="motdePasse"
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
                        <label htmlFor="remember" className="text-gray-700">Remember Password</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#285793] text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
