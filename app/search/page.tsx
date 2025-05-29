"use client"

import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Star, MapPin, DollarSign, Calendar } from 'lucide-react';

// Type definitions
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  location: string;
  date: string;
  tags: string[];
  image: string;
  description: string;
}

type SortField = 'name' | 'price' | 'rating' | 'date';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  priceRange: [number, number];
  minRating: number;
  selectedLocation: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const SearchFilterApp: React.FC = () => {
  // Sample data - in a real app this would come from an API
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Luxury Beach Resort",
      category: "Hotels",
      price: 299,
      rating: 4.8,
      location: "Miami, FL",
      date: "2024-06-15",
      tags: ["luxury", "beach", "spa"],
      image: "🏨",
      description: "Stunning beachfront resort with world-class amenities"
    },
    {
      id: 2,
      name: "Mountain Hiking Adventure",
      category: "Activities",
      price: 89,
      rating: 4.6,
      location: "Denver, CO",
      date: "2024-07-20",
      tags: ["adventure", "outdoor", "hiking"],
      image: "🏔️",
      description: "Guided hiking experience through scenic mountain trails"
    },
    {
      id: 3,
      name: "City Center Boutique Hotel",
      category: "Hotels",
      price: 159,
      rating: 4.4,
      location: "New York, NY",
      date: "2024-08-10",
      tags: ["boutique", "city", "business"],
      image: "🏙️",
      description: "Modern boutique hotel in the heart of Manhattan"
    },
    {
      id: 4,
      name: "Wine Tasting Tour",
      category: "Activities",
      price: 125,
      rating: 4.9,
      location: "Napa Valley, CA",
      date: "2024-09-05",
      tags: ["wine", "tour", "luxury"],
      image: "🍷",
      description: "Premium wine tasting experience in renowned vineyards"
    },
    {
      id: 5,
      name: "Budget Hostel Downtown",
      category: "Hotels",
      price: 45,
      rating: 4.0,
      location: "Austin, TX",
      date: "2024-06-30",
      tags: ["budget", "downtown", "social"],
      image: "🏠",
      description: "Affordable accommodation with great social atmosphere"
    },
    {
      id: 6,
      name: "Cooking Class Experience",
      category: "Activities",
      price: 75,
      rating: 4.7,
      location: "San Francisco, CA",
      date: "2024-08-25",
      tags: ["cooking", "class", "food"],
      image: "👨‍🍳",
      description: "Learn to cook authentic cuisine from expert chefs"
    },
    {
      id: 7,
      name: "Spa Wellness Retreat",
      category: "Wellness",
      price: 220,
      rating: 4.5,
      location: "Sedona, AZ",
      date: "2024-07-15",
      tags: ["spa", "wellness", "relaxation"],
      image: "🧘‍♀️",
      description: "Rejuvenating spa experience in a tranquil desert setting"
    },
    {
      id: 8,
      name: "Art Gallery Tour",
      category: "Culture",
      price: 35,
      rating: 4.3,
      location: "Chicago, IL",
      date: "2024-09-12",
      tags: ["art", "culture", "tour"],
      image: "🎨",
      description: "Explore world-renowned art collections with expert guides"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Get unique values for filter options
  const categories = useMemo<string[]>(() => [...new Set(products.map(p => p.category))], [products]);
  const locations = useMemo<string[]>(() => [...new Set(products.map(p => p.location))], [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo<Product[]>(() => {
    let filtered = products.filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      const matchesLocation = !selectedLocation || product.location === selectedLocation;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesLocation;
    });

    // Sort the filtered results
    filtered.sort((a: Product, b: Product) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, minRating, selectedLocation, sortBy, sortOrder]);

  // Clear all filters
  const clearFilters = (): void => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setMinRating(0);
    setSelectedLocation('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const activeFiltersCount = useMemo<number>(() => {
    return [
      searchTerm,
      selectedCategory,
      selectedLocation,
      minRating > 0,
      priceRange[0] > 0 || priceRange[1] < 500
    ].filter(Boolean).length;
  }, [searchTerm, selectedCategory, selectedLocation, minRating, priceRange]);

  const handlePriceRangeChange = (index: 0 | 1, value: number): void => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const handleRatingClick = (star: number): void => {
    setMinRating(star === minRating ? 0 : star);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value as SortField);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCategory(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedLocation(e.target.value);
  };

  const toggleSortOrder = (): void => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover & Explore</h1>
          <p className="text-gray-600">Find the perfect experiences tailored to your preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Filter className="mr-2" size={20} />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    type="button"
                  >
                    <X size={16} className="mr-1" />
                    Clear ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handlePriceRangeChange(0, parseInt(e.target.value))
                    }
                    className="w-full accent-blue-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handlePriceRangeChange(1, parseInt(e.target.value))
                    }
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star: number) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className={`p-1 ${star <= minRating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
                      type="button"
                    >
                      <Star size={20} fill="currentColor" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {minRating > 0 ? `${minRating}+ stars` : 'Any rating'}
                  </span>
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  {locations.map((location: string) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {/* Sort and Results Header */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {filteredProducts.length} Results Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Showing the best matches for your search
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="date">Sort by Date</option>
                  </select>
                  
                  <button
                    onClick={toggleSortOrder}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    type="button"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{product.image}</div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-1" />
                        <span className="font-semibold text-green-600">${product.price}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Star size={16} className="mr-1 text-yellow-500" fill="currentColor" />
                        <span>{product.rating}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-1" />
                        <span>{product.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-1" />
                        <span>{new Date(product.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.map((tag: string) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button 
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors duration-200 font-medium"
                      type="button"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  type="button"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterApp;