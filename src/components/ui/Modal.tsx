import React, { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  /** Id do elemento que contém o título do modal (acessibilidade). */
  labelledBy: string;
  /** Classes do "cartão" do modal (largura, cor, bordas...). */
  panelClassName: string;
  /** Fecha ao clicar fora. Desligue em formulários para não perder o que foi digitado. */
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
}

/**
 * Casca única para todos os modais: fecha com Esc, trava o scroll da página,
 * foca o modal ao abrir e (opcionalmente) fecha clicando no fundo.
 */
export const Modal: React.FC<ModalProps> = ({
  onClose,
  labelledBy,
  panelClassName,
  closeOnBackdrop = true,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`${panelClassName} outline-none`}
      >
        {children}
      </div>
    </div>
  );
};

