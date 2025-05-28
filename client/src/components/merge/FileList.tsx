
interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  loading: boolean;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove, loading }) => {
  if (files.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-md font-medium text-gray-700 mb-2">
        Selected Files ({files.length})
      </h3>
      <ul className="max-h-40 overflow-y-auto border border-gray-200 rounded-md divide-y">
        {files.map((file, index) => (
          <li key={index} className="flex justify-between items-center py-2 px-3 text-sm">
            <span className="truncate max-w-xs">{file.name}</span>
            <button 
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};