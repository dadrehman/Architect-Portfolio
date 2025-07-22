// src/pages/Analytics.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { FaChartLine } from 'react-icons/fa';
import Card from '../components/ui/Card';
import { analyticsService } from '../services/api';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching analytics...');
        
        const response = await analyticsService.getAnalytics();
        console.log('✅ Analytics Response:', response);
        
        // Handle different response structures
        let analyticsResult = [];
        if (response?.data?.data) {
          analyticsResult = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          analyticsResult = response.data;
        } else if (Array.isArray(response)) {
          analyticsResult = response;
        }
        
        // Ensure it's an array
        analyticsResult = Array.isArray(analyticsResult) ? analyticsResult : [];
        
        setAnalyticsData(analyticsResult);
        
        console.log('📊 Loaded analytics:', analyticsResult.length, 'entries');
        
      } catch (error) {
        console.error('💥 Error fetching analytics:', error);
        setError('Failed to load analytics data. Please try again.');
        toast.error('Failed to load analytics data');
        
        // Set empty array to prevent crashes
        setAnalyticsData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500">View website analytics and visitor statistics.</p>
        </div>
        <Card>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500">View website analytics and visitor statistics.</p>
        </div>
        <Card>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-500">View website analytics and visitor statistics.</p>
      </div>

      <Card>
        {analyticsData.length === 0 ? (
          <div className="py-6 text-center">
            <FaChartLine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No analytics data available. Visit some pages to generate data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-gray-800 flex items-center">
              <FaChartLine className="mr-2" />
              Page Visits
            </h2>
            <div className="divide-y divide-gray-200">
              {analyticsData.map((data, index) => (
                <div key={index} className="py-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{data.page_url}</h3>
                    <p className="text-sm text-gray-500">
                      Last visited: {new Date(data.last_visited).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    {data.visits} Visits
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;