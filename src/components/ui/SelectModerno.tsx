import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectModernoProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: string;
}

export const SelectModerno = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  disabled = false,
  required = false,
  icon = 'fas fa-chevron-down'
}: SelectModernoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Obtener label del valor seleccionado
  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="select-moderno-container" ref={containerRef}>
      <label className="select-moderno-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      <div className={`select-moderno ${isOpen ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
        <div 
          className="select-moderno-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={`select-moderno-value ${!value ? 'placeholder' : ''}`}>
            {selectedLabel}
          </span>
          <i className={`${icon} select-moderno-icon ${isOpen ? 'rotate' : ''}`}></i>
        </div>

        {isOpen && !disabled && (
          <div className="select-moderno-dropdown">
            <div className="select-moderno-options">
              {options.length === 0 ? (
                <div className="select-moderno-option empty">
                  No hay opciones disponibles
                </div>
              ) : (
                options.map((option) => (
                  <div
                    key={option.value}
                    className={`select-moderno-option ${option.value === value ? 'selected' : ''}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                    {option.value === value && (
                      <i className="fas fa-check"></i>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
