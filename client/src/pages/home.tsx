import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type DictionaryEntry } from "@shared/schema";
import SearchBar from "@/components/search-bar";
import AlphabetNav from "@/components/alphabet-nav";
import DictionaryEntryComponent from "@/components/dictionary-entry";
import ScriptToggle from "@/components/script-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [scriptType, setScriptType] = useState<'traditional' | 'cyrillic'>('traditional');
  const [showMore, setShowMore] = useState(false);

  // Search entries based on query or letter
  const { data: entries = [], isLoading } = useQuery<DictionaryEntry[]>({
    queryKey: selectedLetter 
      ? ['/api/dictionary/letter', selectedLetter, scriptType]
      : ['/api/dictionary/search', searchQuery, showMore ? 50 : 20],
    queryFn: async () => {
      if (selectedLetter) {
        const response = await fetch(`/api/dictionary/letter/${encodeURIComponent(selectedLetter)}?script=${scriptType}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      } else {
        const params = new URLSearchParams({
          q: searchQuery,
          limit: (showMore ? 50 : 20).toString()
        });
        const response = await fetch(`/api/dictionary/search?${params}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      }
    },
    enabled: true,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedLetter(""); // Clear letter filter when searching
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setSearchQuery(""); // Clear search when browsing by letter
  };

  const getResultsTitle = () => {
    if (selectedLetter) {
      return `"${selectedLetter}" 로 시작하는 단어`;
    }
    if (searchQuery) {
      return "검색 결과";
    }
    return "최근 단어";
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary" data-testid="site-title">
                몽골어 사전
              </h1>
              <span className="text-sm text-gray-500 hidden sm:block">
                Mongolian Dictionary
              </span>
            </div>
            
            <ScriptToggle 
              scriptType={scriptType} 
              onToggle={setScriptType}
              data-testid="script-toggle"
            />
          </div>
          
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={searchQuery}
            data-testid="search-bar"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Alphabet Navigation */}
        <AlphabetNav 
          onLetterSelect={handleLetterSelect}
          selectedLetter={selectedLetter}
          scriptType={scriptType}
          data-testid="alphabet-nav"
        />

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800" data-testid="results-title">
              {getResultsTitle()}
            </h2>
            <span className="text-sm text-gray-500" data-testid="results-count">
              총 {entries.length}개 결과
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500" data-testid="no-results">
                검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <DictionaryEntryComponent 
                    key={entry.id} 
                    entry={entry} 
                    scriptType={scriptType}
                    data-testid={`entry-${entry.id}`}
                  />
                ))}
              </div>

              {!selectedLetter && entries.length >= 20 && (
                <div className="flex justify-center pt-6">
                  <Button 
                    onClick={() => setShowMore(!showMore)}
                    className="px-6 py-3 bg-primary text-white hover:bg-blue-700"
                    data-testid="load-more-button"
                  >
                    {showMore ? "간단히 보기" : "더 많은 결과 보기"}
                  </Button>
                </div>
              )}
            </>
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
