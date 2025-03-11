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
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use ref to track if mouse is down to prevent "stuck" panning state
  const isMouseDownRef = useRef(false);

  // Function to calculate maximum panning boundaries
  const calculateBoundaries = () => {
    if (!containerRef.current || !contentRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    
    // Calculate how far the content can be moved in each direction
    const minX = containerRect.width - contentRect.width;
    const maxX = 0;
    const minY = containerRect.height - contentRect.height;
    const maxY = 0;
    
    return {
      minX: Math.min(0, minX), // Negative value if content is wider than container
      maxX: Math.max(0, maxX), // Always 0 or positive
      minY: Math.min(0, minY), // Negative value if content is taller than container
      maxY: Math.max(0, maxY), // Always 0 or positive
    };
  };

  // Apply boundaries to a position
  const applyBoundaries = (pos: PanPosition) => {
    const { minX, maxX, minY, maxY } = calculateBoundaries();
    return {
      x: Math.min(maxX, Math.max(minX, pos.x)),
      y: Math.min(maxY, Math.max(minY, pos.y)),
    };
  };

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
        
        // Apply boundaries before setting the position
        const boundedPosition = applyBoundaries({ x: newX, y: newY });
        setPosition(boundedPosition);
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

  // Recalculate boundaries when the content size changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // Ensure position is within boundaries after resize
      setPosition(prev => applyBoundaries(prev));
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
          setPosition(prev => {
            const newPos = { ...prev, y: prev.y + keyboardPanAmount };
            return applyBoundaries(newPos);
          });
          break;
        case 'ArrowDown':
          setPosition(prev => {
            const newPos = { ...prev, y: prev.y - keyboardPanAmount };
            return applyBoundaries(newPos);
          });
          break;
        case 'ArrowLeft':
          setPosition(prev => {
            const newPos = { ...prev, x: prev.x + keyboardPanAmount };
            return applyBoundaries(newPos);
          });
          break;
        case 'ArrowRight':
          setPosition(prev => {
            const newPos = { ...prev, x: prev.x - keyboardPanAmount };
            return applyBoundaries(newPos);
          });
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
        ref={contentRef}
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