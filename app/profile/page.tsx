'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
//@ts-ignore
export default function UserInfoEdit({ userInfo }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: userInfo?.email || '',
    pinata_jwt: userInfo?.pinata_jwt || '',
    next_public_gateWay: userInfo?.next_public_gateWay || '',
    next_public_gateWay_token: userInfo?.next_public_gateWay_token || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  //@ts-ignore  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //@ts-ignore  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      console.log(formData)
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(response)
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user information');
      }

      setMessage('User information updated successfully!');
      // Optional: Redirect or refresh data
      // router.refresh(); // If using app router to refresh server components
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit User Information</h1>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pinata_jwt" className="block text-sm font-medium text-gray-700 mb-1">
            Pinata JWT
          </label>
          <input
            type="text"
            id="pinata_jwt"
            name="pinata_jwt"
            value={formData.pinata_jwt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="next_public_gateWay" className="block text-sm font-medium text-gray-700 mb-1">
            Gateway URL
          </label>
          <input
            type="text"
            id="next_public_gateWay"
            name="next_public_gateWay"
            value={formData.next_public_gateWay}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="next_public_gateWay_token" className="block text-sm font-medium text-gray-700 mb-1">
            Gateway Token
          </label>
          <input
            type="text"
            id="next_public_gateWay_token"
            name="next_public_gateWay_token"
            value={formData.next_public_gateWay_token}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
