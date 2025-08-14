import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Heart, Share } from "lucide-react";
import { type DictionaryEntry, type Example } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface DictionaryEntryProps {
  entry: DictionaryEntry;
  scriptType: 'traditional' | 'cyrillic';
  "data-testid"?: string;
}

export default function DictionaryEntryComponent({ 
  entry, 
  scriptType, 
  "data-testid": testId 
}: DictionaryEntryProps) {
  const { toast } = useToast();
  
  const mongolianText = scriptType === 'traditional' 
    ? entry.mongolianTraditional 
    : entry.mongolianCyrillic;

  const getPartOfSpeechColor = (partOfSpeech: string) => {
    switch (partOfSpeech) {
      case '명사':
        return 'bg-secondary/10 text-secondary';
      case '동사':
        return 'bg-accent/10 text-accent';
      case '형용사':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handlePronunciation = () => {
    // TODO: Implement audio pronunciation
    toast({
      title: "발음 재생",
      description: "발음 기능은 곧 구현될 예정입니다.",
    });
  };

  const handleFavorite = () => {
    toast({
      title: "즐겨찾기 추가",
      description: "즐겨찾기에 추가되었습니다.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mongolianText} - 몽골어 사전`,
        text: `${mongolianText}: ${entry.korean}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${mongolianText}: ${entry.korean}`);
      toast({
        title: "복사 완료",
        description: "링크가 클립보드에 복사되었습니다.",
      });
    }
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
      data-testid={testId}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Word Information */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 
              className={`text-2xl font-medium ${scriptType === 'traditional' ? 'font-mongolian' : ''}`}
              data-testid="word-mongolian"
            >
              {mongolianText}
            </h3>
            <Badge 
              className={getPartOfSpeechColor(entry.partOfSpeech)}
              data-testid="part-of-speech"
            >
              {entry.partOfSpeech}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePronunciation}
              className="text-gray-400 hover:text-primary p-1"
              data-testid="pronunciation-button"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Pronunciation */}
          <div className="mb-3">
            <span className="text-sm text-gray-600">발음: </span>
            <span className="text-base font-medium" data-testid="pronunciation">
              {entry.pronunciation}
            </span>
          </div>

          {/* Translations */}
          <div className="space-y-2 mb-4">
            <div>
              <span className="text-sm font-medium text-gray-700">한국어: </span>
              <span className="text-base" data-testid="translation-korean">
                {entry.korean}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">English: </span>
              <span className="text-base" data-testid="translation-english">
                {entry.english}
              </span>
            </div>
          </div>

          {/* Example Sentences */}
          {Array.isArray(entry.examples) && entry.examples.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">예문:</h4>
              <div className="space-y-3">
                {entry.examples.map((example: Example, index: number) => (
                  <div key={index} className="mb-3 last:mb-0" data-testid={`example-${index}`}>
                    <p 
                      className={`text-base mb-1 ${scriptType === 'traditional' ? 'font-mongolian' : ''}`}
                      data-testid="example-mongolian"
                    >
                      {scriptType === 'traditional' 
                        ? example.mongolianTraditional 
                        : example.mongolianCyrillic}
                    </p>
                    <p className="text-gray-600 text-sm" data-testid="example-translation">
                      {example.korean}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex lg:flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavorite}
            className="flex items-center gap-2"
            data-testid="favorite-button"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">즐겨찾기</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
            data-testid="share-button"
          >
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">공유</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
