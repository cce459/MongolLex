import { Button } from "@/components/ui/button";

interface ScriptToggleProps {
  scriptType: 'traditional' | 'cyrillic';
  onToggle: (scriptType: 'traditional' | 'cyrillic') => void;
  "data-testid"?: string;
}

export default function ScriptToggle({ scriptType, onToggle, "data-testid": testId }: ScriptToggleProps) {
  return (
    <div 
      className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1"
      data-testid={testId}
    >
      <Button
        variant={scriptType === 'traditional' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onToggle('traditional')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          scriptType === 'traditional' 
            ? 'bg-primary text-white' 
            : 'text-gray-600 hover:bg-white'
        }`}
        data-testid="traditional-button"
      >
        전통 몽골어
      </Button>
      <Button
        variant={scriptType === 'cyrillic' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onToggle('cyrillic')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          scriptType === 'cyrillic' 
            ? 'bg-primary text-white' 
            : 'text-gray-600 hover:bg-white'
        }`}
        data-testid="cyrillic-button"
      >
        키릴 몽골어
      </Button>
    </div>
  );
}
