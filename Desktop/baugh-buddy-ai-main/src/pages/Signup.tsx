import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const navigate = useNavigate();

  const handlePickLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      });
    } else {
      alert('Geolocation is not supported');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage for demo (replace with API call in production)
    localStorage.setItem('userProfile', JSON.stringify({ name, phone, password, location, size }));
    navigate('/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <label className="block mb-2">Name</label>
        <input className="w-full mb-4 p-2 border rounded" value={name} onChange={e => setName(e.target.value)} required />
        <label className="block mb-2">Phone Number</label>
        <input className="w-full mb-4 p-2 border rounded" value={phone} onChange={e => setPhone(e.target.value)} required type="tel" />
        <label className="block mb-2">Password</label>
        <input className="w-full mb-4 p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
        <label className="block mb-2">Field Location</label>
        <div className="flex mb-4">
          <input className="flex-1 p-2 border rounded" value={location} readOnly required />
          <button type="button" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handlePickLocation}>Pick Location</button>
        </div>
        <label className="block mb-2">Field Size (acres)</label>
        <input className="w-full mb-6 p-2 border rounded" value={size} onChange={e => setSize(e.target.value)} required type="number" min="0" />
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
