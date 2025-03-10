import React, { useState, useRef, useEffect, type ReactNode } from 'react';

interface PanPosition {
  x: number;
  y: number;
}

interface PanContainerProps {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  containerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  enableKeyboardControls?: boolean;
  keyboardPanAmount?: number;
}

export const PanContainer: React.FC<PanContainerProps> = ({
  children,
  disabled = false,
  className = '',
  containerStyle = {},
  contentStyle = {},
  enableKeyboardControls = true,
  keyboardPanAmount = 20,
}) => {
  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<PanPosition>({ x: 0, y: 0 });
  const [position, setPosition] = useState<PanPosition>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Panning event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsPanning(true);
    setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const newX = e.clientX - startPan.x;
    const newY = e.clientY - startPan.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Reset pan position
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!enableKeyboardControls || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setPosition(prev => ({ ...prev, y: prev.y + keyboardPanAmount }));
          break;
        case 'ArrowDown':
          setPosition(prev => ({ ...prev, y: prev.y - keyboardPanAmount }));
          break;
        case 'ArrowLeft':
          setPosition(prev => ({ ...prev, x: prev.x + keyboardPanAmount }));
          break;
        case 'ArrowRight':
          setPosition(prev => ({ ...prev, x: prev.x - keyboardPanAmount }));
          break;
        case 'Home':
          resetPosition();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardControls, disabled, keyboardPanAmount]);

  return (
    <div
      ref={containerRef}
      className={`pan-container ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        cursor: disabled ? 'default' : isPanning ? 'grabbing' : 'grab',
        ...containerStyle,
      }}
    >
      <div
        className="pan-content"
        style={{
          position: 'absolute',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};