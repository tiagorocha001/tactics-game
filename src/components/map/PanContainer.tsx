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
  
  // Use ref to track if mouse is down to prevent "stuck" panning state
  const isMouseDownRef = useRef(false);

  // Global mouse event handlers to ensure we capture events even when they happen outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
      }
      isMouseDownRef.current = false;
    };
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning && isMouseDownRef.current) {
        const newX = e.clientX - startPan.x;
        const newY = e.clientY - startPan.y;
        setPosition({ x: newX, y: newY });
      } else if (isPanning && !isMouseDownRef.current) {
        // If mouse isn't down but we're still in panning state, fix it
        setIsPanning(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isPanning, startPan]);

  // Component-specific event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    // Prevent panning if right click
    if (e.button !== 0) return;
    
    isMouseDownRef.current = true;
    setIsPanning(true);
    setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
    
    // Prevent text selection during panning
    e.preventDefault();
  };

  // Reset pan position
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Handle additional clicks that might happen when the state is stuck
  const handleClick = () => {
    if (isPanning && !isMouseDownRef.current) {
      setIsPanning(false);
    }
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
        case 'Escape':
          // Escape key as additional way to cancel panning if it gets stuck
          if (isPanning) {
            setIsPanning(false);
            isMouseDownRef.current = false;
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardControls, disabled, keyboardPanAmount, isPanning]);

  return (
    <div
      ref={containerRef}
      className={`pan-container ${className}`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        cursor: disabled ? 'default' : isPanning ? 'grabbing' : 'grab',
        userSelect: 'none', // Prevent text selection
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