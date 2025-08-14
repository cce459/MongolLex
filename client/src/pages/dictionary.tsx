import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DictionaryEntry } from "@shared/schema";
import SearchBar from "@/components/search-bar";
import AlphabetNav from "@/components/alphabet-nav";
import DictionaryEntryComponent from "@/components/dictionary-entry";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [scriptType, setScriptType] = useState<"traditional" | "cyrillic">("traditional");

  const { data: searchResults, isLoading: isSearching } = useQuery<DictionaryEntry[]>({
    queryKey: ["/api/dictionary/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/dictionary/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: Boolean(searchQuery.trim()),
  });

  const { data: letterResults, isLoading: isLoadingLetter } = useQuery<DictionaryEntry[]>({
    queryKey: ["/api/dictionary/letter", selectedLetter],
    queryFn: async () => {
      if (!selectedLetter) return [];
      const response = await fetch(`/api/dictionary/letter/${encodeURIComponent(selectedLetter)}`);
      if (!response.ok) throw new Error("Letter browse failed");
      return response.json();
    },
    enabled: Boolean(selectedLetter),
  });

  const { data: allEntries, isLoading: isLoadingAll } = useQuery<DictionaryEntry[]>({
    queryKey: ["/api/dictionary"],
    queryFn: async () => {
      const response = await fetch("/api/dictionary");
      if (!response.ok) throw new Error("Failed to load dictionary");
      return response.json();
    },
    enabled: !searchQuery.trim() && !selectedLetter,
  });

  const displayResults = searchQuery.trim() 
    ? searchResults 
    : selectedLetter 
    ? letterResults 
    : allEntries;

  const isLoading = isSearching || isLoadingLetter || isLoadingAll;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedLetter(null);
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setSearchQuery("");
  };

  const getResultsTitle = () => {
    if (searchQuery.trim()) {
      return "검색 결과";
    }
    if (selectedLetter) {
      return `"${selectedLetter}"로 시작하는 단어`;
    }
    return "전체 단어";
  };

  return (
    <div className="bg-surface font-interface text-gray-800 min-h-screen">
      {/* Header with Search */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">몽골어 사전</h1>
              <span className="text-sm text-gray-500 hidden sm:block">Mongolian Dictionary</span>
            </div>
            
            {/* Script Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={scriptType === "traditional" ? "default" : "ghost"}
                onClick={() => setScriptType("traditional")}
                className="text-xs"
                data-testid="button-traditional-script"
              >
                전통 몽골어
              </Button>
              <Button
                size="sm"
                variant={scriptType === "cyrillic" ? "default" : "ghost"}
                onClick={() => setScriptType("cyrillic")}
                className="text-xs"
                data-testid="button-cyrillic-script"
              >
                키릴 몽골어
              </Button>
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} currentQuery={searchQuery} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Alphabet Navigation */}
        <AlphabetNav 
          onLetterSelect={handleLetterSelect} 
          selectedLetter={selectedLetter} 
        />

        {/* Search Results / Dictionary Entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800" data-testid="text-results-title">
              {getResultsTitle()}
            </h2>
            {displayResults && (
              <span className="text-sm text-gray-500" data-testid="text-results-count">
                총 {displayResults.length}개 결과
              </span>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Dictionary Entries */}
          {displayResults && displayResults.length > 0 && (
            <div className="space-y-4">
              {displayResults.map((entry) => (
                <DictionaryEntryComponent
                  key={entry.id}
                  entry={entry}
                  scriptType={scriptType}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && displayResults && displayResults.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2" data-testid="text-no-results">
                검색 결과가 없습니다
              </div>
              <p className="text-gray-400 text-sm">
                다른 검색어를 시도해보세요
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">몽골어 사전</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                전통 몽골 문자와 키릴 몽골어를 지원하는 포괄적인 온라인 사전입니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-4">빠른 링크</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">알파벳 가이드</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">발음 가이드</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">문법 가이드</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">학습 자료</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-4">지원</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">도움말</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">피드백</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">개인정보 보호</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">이용약관</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600 text-sm">© 2024 몽골어 사전. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
