"use client";
import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const subscriptionData = [
    { id: 1, name: 'Netflix', category: 'Entertainment', yearlyCost: 120, nextPayment: '2024-03-15', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Netflix_icon.svg/2048px-Netflix_icon.svg.png' },
    { id: 2, name: 'Spotify', category: 'Entertainment', yearlyCost: 100, nextPayment: '2024-04-10', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Spotify_logo_2023.svg/2048px-Spotify_logo_2023.svg.png' },
    { id: 3, name: 'Gym Membership', category: 'Fitness', yearlyCost: 500, nextPayment: '2024-05-01', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Yogacentral.svg/1137px-Yogacentral.svg.png' },
];

// Predefined colors for categories
const categoryColors = {
    Entertainment: '#FF6B6B',
    Fitness: '#4ECDC4',
};

const SubscriptionDashboard = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [ghostMode, setGhostMode] = useState(false);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState(subscriptionData.map(sub => sub.id));

    const toggleTheme = () => setIsDarkTheme(prev => !prev);
    const toggleGhostMode = () => setGhostMode(prev => !prev);
    const toggleSubscription = (id: number) => {
        setSelectedSubscriptions(prev =>
            prev.includes(id) ? prev.filter(subId => subId !== id) : [...prev, id]
        );
    };

    const filteredSubscriptions = useMemo(() => {
        return ghostMode
            ? subscriptionData.filter(sub => selectedSubscriptions.includes(sub.id))
            : subscriptionData;
    }, [ghostMode, selectedSubscriptions]);

    const totalYearlyCost = useMemo(() => {
        return filteredSubscriptions.reduce((acc, sub) => acc + sub.yearlyCost, 0);
    }, [filteredSubscriptions]);

    const chartData = useMemo(() => {
        const categoryCosts: { [key: string]: number } = {};
        filteredSubscriptions.forEach(sub => {
            categoryCosts[sub.category] = (categoryCosts[sub.category] || 0) + sub.yearlyCost;
        });

        return {
            labels: Object.keys(categoryCosts),
            datasets: [{
                label: 'Yearly Cost by Category',
                data: Object.values(categoryCosts),
                backgroundColor: Object.keys(categoryCosts).map(category => categoryColors[category] || '#6C5CE7'),
                borderWidth: 0,
                borderRadius: 8,
            }],
        };
    }, [filteredSubscriptions]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: isDarkTheme ? '#E2E8F0' : '#2D3748',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                },
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: isDarkTheme ? '#E2E8F0' : '#2D3748',
                    font: {
                        family: "'Inter', sans-serif",
                    },
                },
            },
            y: {
                grid: {
                    color: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
                ticks: {
                    color: isDarkTheme ? '#E2E8F0' : '#2D3748',
                    font: {
                        family: "'Inter', sans-serif",
                    },
                },
            },
        },
    };

    return (
        <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 p-4 sm:p-6`}>
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Subscription Tracker</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={toggleGhostMode}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                ghostMode 
                                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                        >
                            Ghost Mode
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            {isDarkTheme ? '🌞' : '🌙'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <h2 className="text-xl font-semibold mb-4">Total Annual Cost</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                ${totalYearlyCost.toLocaleString()}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">/year</span>
                        </div>
                    </div>
                    
                    <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <h2 className="text-xl font-semibold mb-4">Active Subscriptions</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {filteredSubscriptions.length}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">services</span>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6`}>
                    <h2 className="text-xl font-semibold mb-6">Cost by Category</h2>
                    <div className="h-[300px]">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className={`rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <h2 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700">
                        Subscription Details
                    </h2>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {subscriptionData.map(sub => (
                            <li 
                                key={sub.id} 
                                className={`p-6 flex items-center justify-between transition-colors ${
                                    ghostMode && !selectedSubscriptions.includes(sub.id)
                                        ? 'opacity-50'
                                        : ''
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 p-2 flex items-center justify-center">
                                        <img src={sub.logo} alt={`${sub.name} Logo`} className="max-w-full max-h-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{sub.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Next payment: {new Date(sub.nextPayment).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        ${sub.yearlyCost}/year
                                    </span>
                                    {ghostMode && (
                                        <button
                                            onClick={() => toggleSubscription(sub.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                selectedSubscriptions.includes(sub.id)
                                                    ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                            }`}
                                        >
                                            {selectedSubscriptions.includes(sub.id) ? 'Remove' : 'Add Back'}
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDashboard; 