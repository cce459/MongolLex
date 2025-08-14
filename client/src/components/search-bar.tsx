import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { type DictionaryEntry } from "@shared/schema";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  "data-testid"?: string;
}

export default function SearchBar({ onSearch, initialValue = "", "data-testid": testId }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  // Debounce input for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Get suggestions
  const { data: suggestions = [] } = useQuery<DictionaryEntry[]>({
    queryKey: ['/api/dictionary/search', debouncedValue, 5],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: debouncedValue,
        limit: '5'
      });
      const response = await fetch(`/api/dictionary/search?${params}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return response.json();
    },
    enabled: debouncedValue.length > 0 && showSuggestions,
  });

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => 
      suggestion.mongolianTraditional.toLowerCase() !== inputValue.toLowerCase() &&
      suggestion.mongolianCyrillic.toLowerCase() !== inputValue.toLowerCase() &&
      suggestion.korean.toLowerCase() !== inputValue.toLowerCase() &&
      suggestion.english.toLowerCase() !== inputValue.toLowerCase()
    );
  }, [suggestions, inputValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSearch = () => {
    onSearch(inputValue);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: DictionaryEntry) => {
    const text = suggestion.korean; // Use Korean translation as default
    setInputValue(text);
    onSearch(text);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative" data-testid={testId}>
      <div className="relative">
        <Input
          type="text"
          placeholder="몽골어, 한국어, 영어로 검색하세요..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyPress}
          className="w-full px-4 py-3 pl-12 pr-20 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          data-testid="search-input"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-400 hover:text-primary p-1"
              data-testid="clear-button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleSearch}
            className="bg-primary text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            data-testid="search-button"
          >
            검색
          </Button>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
          data-testid="suggestions-dropdown"
        >
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              data-testid={`suggestion-${suggestion.id}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mongolian text-lg">
                    {suggestion.mongolianTraditional}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {suggestion.korean}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {suggestion.partOfSpeech}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
