// Create this as src/components/ApiTester.js - TEMPORARY DEBUGGING COMPONENT
import React, { useState } from 'react';

const ApiTester = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const testEndpoints = async () => {
    setTesting(true);
    setResults([]);
    
    const API_BASE_URL = 'https://api.architectshahab.site';
    const testCredentials = {
      email: 'admin@example.com',
      password: 'password123'
    };

    const possibleEndpoints = [
      `${API_BASE_URL}/api/auth/login`,
      `${API_BASE_URL}/api/admin/login`,
      `${API_BASE_URL}/api/user/login`,
      `${API_BASE_URL}/api/login`,
      `${API_BASE_URL}/auth/login`,
      `${API_BASE_URL}/admin/login`,
      `${API_BASE_URL}/user/login`,
      `${API_BASE_URL}/login`
    ];

    const testResults = [];

    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testCredentials),
        });

        const result = {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        };

        if (response.ok) {
          try {
            const data = await response.json();
            result.data = data;
            result.hasToken = !!(data.token || data.data?.token || data.accessToken);
          } catch (e) {
            result.jsonError = 'Could not parse JSON response';
          }
        } else if (response.status !== 404) {
          try {
            const errorData = await response.json();
            result.errorData = errorData;
          } catch (e) {
            result.errorData = 'Could not parse error response';
          }
        }

        testResults.push(result);
      } catch (error) {
        testResults.push({
          endpoint,
          error: error.message
        });
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  const getStatusColor = (result) => {
    if (result.error) return 'text-red-600';
    if (result.ok) return 'text-green-600';
    if (result.status === 404) return 'text-gray-500';
    if (result.status === 401) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (result) => {
    if (result.error) return '💥';
    if (result.ok) return '✅';
    if (result.status === 404) return '❌';
    if (result.status === 401) return '🔐';
    return '⚠️';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">API Endpoint Tester</h2>
        <p className="text-gray-600 mb-4">
          This will test all possible login endpoints to find the one that works with your backend.
        </p>
        
        <button
          onClick={testEndpoints}
          disabled={testing}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Testing Endpoints...' : 'Test All Login Endpoints'}
        </button>

        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(result)}</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {result.endpoint}
                      </code>
                    </div>
                    <div className={`font-semibold ${getStatusColor(result)}`}>
                      {result.error ? 'Network Error' : `${result.status} ${result.statusText}`}
                    </div>
                  </div>
                  
                  {result.ok && (
                    <div className="mt-2 p-3 bg-green-50 rounded">
                      <p className="text-green-800 font-semibold">✅ This endpoint works!</p>
                      {result.hasToken && (
                        <p className="text-green-700">🔑 Token received in response</p>
                      )}
                      <details className="mt-2">
                        <summary className="cursor-pointer text-green-700">View Response</summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                  
                  {result.status === 401 && (
                    <div className="mt-2 p-3 bg-yellow-50 rounded">
                      <p className="text-yellow-800">🔐 Endpoint exists but credentials were rejected</p>
                      <p className="text-yellow-700 text-sm">This means the endpoint is correct but you need valid credentials</p>
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="mt-2 p-3 bg-red-50 rounded">
                      <p className="text-red-800">💥 Network Error: {result.error}</p>
                    </div>
                  )}
                  
                  {result.errorData && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-red-700">View Error Response</summary>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded border overflow-auto">
                        {JSON.stringify(result.errorData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTester;