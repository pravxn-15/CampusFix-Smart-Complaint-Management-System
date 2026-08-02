import { useRef, useState } from "react";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import "./FileUpload.css";

export default function FileUpload({ files = [], onChange, maxFiles = 4 }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(fileList) {
    const incoming = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, maxFiles - files.length)
      .map((file) => ({ file, url: URL.createObjectURL(file), name: file.name }));
    onChange([...files, ...incoming]);
  }

  function removeFile(index) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        className={`file-upload ${dragOver ? "file-upload--drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <FiUploadCloud className="file-upload__icon" aria-hidden="true" />
        <p>
          <strong>Click to upload</strong> or drag and drop
        </p>
        <span className="text-xs text-secondary">PNG or JPG, up to {maxFiles} images</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="file-upload__previews">
          {files.map((f, i) => (
            <div key={i} className="file-upload__preview">
              <img src={f.url} alt={f.name} />
              <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>
                <FiX />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, maxFiles - files.length) }).map((_, i) => (
            <div key={`ph-${i}`} className="file-upload__placeholder">
              <FiImage aria-hidden="true" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
