import { Button } from "@/components/ui/button";

interface AlphabetNavProps {
  onLetterSelect: (letter: string) => void;
  selectedLetter: string;
  scriptType: 'traditional' | 'cyrillic';
  "data-testid"?: string;
}

const traditionalLetters = [
  'ᠠ', 'ᠡ', 'ᠢ', 'ᠣ', 'ᠤ', 'ᠥ', 'ᠦ', 'ᠨ', 'ᠩ', 'ᠪ',
  'ᠫ', 'ᠮ', 'ᠯ', 'ᠰ', 'ᠱ', 'ᠲ', 'ᠳ', 'ᠴ', 'ᠵ', 'ᠶ',
  'ᠷ', 'ᠸ', 'ᠹ', 'ᠺ', 'ᠻ', 'ᠼ', 'ᠽ', 'ᠾ', 'ᠿ', 'ᡀ'
];

const cyrillicLetters = [
  'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и',
  'й', 'к', 'л', 'м', 'н', 'о', 'ө', 'п', 'р', 'с',
  'т', 'у', 'ү', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ',
  'ы', 'ь', 'э', 'ю', 'я'
];

export default function AlphabetNav({ 
  onLetterSelect, 
  selectedLetter, 
  scriptType, 
  "data-testid": testId 
}: AlphabetNavProps) {
  const letters = scriptType === 'traditional' ? traditionalLetters : cyrillicLetters;

  return (
    <div className="mb-8" data-testid={testId}>
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        알파벳순 찾아보기
      </h2>
      <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-15 gap-2">
        {letters.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? "default" : "outline"}
            className={`
              aspect-square bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors flex items-center justify-center text-lg font-medium
              ${scriptType === 'traditional' ? 'font-mongolian' : ''}
              ${selectedLetter === letter ? 'bg-primary text-primary-foreground border-primary' : ''}
            `}
            onClick={() => onLetterSelect(letter)}
            data-testid={`letter-${letter}`}
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}
