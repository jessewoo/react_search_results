'use client'

import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

const SearchResultsPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Mock API function - replace with your actual API endpoint
    const searchAPI = async (searchQuery) => {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual API call
        const mockResults = [
            {
                id: 1,
                title: `How to ${searchQuery}`,
                description: `A comprehensive guide on ${searchQuery} with step-by-step instructions and best practices.`,
                url: `https://example.com/guide-${searchQuery.replace(/\s+/g, '-')}`,
                category: 'Tutorial'
            },
            {
                id: 2,
                title: `${searchQuery} - Complete Reference`,
                description: `Everything you need to know about ${searchQuery}, including advanced techniques and common pitfalls.`,
                url: `https://example.com/reference-${searchQuery.replace(/\s+/g, '-')}`,
                category: 'Reference'
            },
            {
                id: 3,
                title: `Top 10 ${searchQuery} Tips`,
                description: `Professional tips and tricks for mastering ${searchQuery} from industry experts.`,
                url: `https://example.com/tips-${searchQuery.replace(/\s+/g, '-')}`,
                category: 'Tips'
            }
        ];

        // Simulate potential API error
        if (searchQuery.toLowerCase() === 'error') {
            throw new Error('Search service temporarily unavailable');
        }

        return mockResults;
    };

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            return
        };

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const searchResults = await searchAPI(searchQuery);
            setResults(searchResults);
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setResults([]);
                setHasSearched(false);
                setError(null);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);



    const getCategoryColor = (category) => {
        const colors = {
            Tutorial: 'bg-blue-100 text-blue-800',
            Reference: 'bg-green-100 text-green-800',
            Tips: 'bg-purple-100 text-purple-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Portal</h1>
                    <p className="text-gray-600">Find what you're looking for</p>
                </div>

                {/* Search Input */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && performSearch(query)}
                            placeholder="Enter your search query..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Searching...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && hasSearched && results.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-2">No results found</div>
                        <p className="text-gray-400">Try adjusting your search terms</p>
                    </div>
                )}

                {/* Search Results */}
                {!loading && results.length > 0 && (
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600 mb-4">
                            Found {results.length} results for "{query}"
                        </div>

                        {results.map((result) => (
                            <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                                        {result.title}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                                        {result.category}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    {result.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-green-600 truncate">
                                        {result.url}
                                    </span>
                                    <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                        Visit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Initial State */}
                {!hasSearched && !loading && (
                    <div className="text-center py-12">
                        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Start typing to search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;