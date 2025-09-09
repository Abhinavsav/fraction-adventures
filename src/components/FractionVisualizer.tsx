// Visual fraction representations with drag & drop

import React, { useState, useRef, useEffect } from 'react';
import { Fraction, DragItem, DropZone } from '../types/game';
import { FractionMath } from '../utils/fractionMath';

interface FractionVisualizerProps {
  fraction: Fraction;
  type: 'cake' | 'pizza' | 'laddus';
  interactive?: boolean;
  onPieceInteraction?: (piece: DragItem, action: 'pickup' | 'drop') => void;
  className?: string;
}

export const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  fraction,
  type,
  interactive = false,
  onPieceInteraction,
  className = ""
}) => {
  const [pieces, setPieces] = useState<DragItem[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<DragItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generatePieces();
  }, [fraction, type]);

  const generatePieces = () => {
    const newPieces: DragItem[] = [];
    
    for (let i = 0; i < fraction.numerator; i++) {
      newPieces.push({
        id: `${type}_piece_${i}`,
        type: type === 'laddus' ? 'laddu' : type === 'pizza' ? 'pizza-slice' : 'cake-slice',
        value: 1 / fraction.denominator,
        position: { x: 0, y: 0 },
        isDragging: false
      });
    }
    
    setPieces(newPieces);
  };

  const handlePointerDown = (e: React.PointerEvent, piece: DragItem) => {
    if (!interactive) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    
    const updatedPiece = {
      ...piece,
      isDragging: true,
      position: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    };
    
    setDraggedPiece(updatedPiece);
    onPieceInteraction?.(updatedPiece, 'pickup');
    
    // Add global pointer events
    document.addEventListener('pointermove', handleGlobalPointerMove);
    document.addEventListener('pointerup', handleGlobalPointerUp);
  };

  const handleGlobalPointerMove = (e: PointerEvent) => {
    if (!draggedPiece || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const updatedPiece = {
      ...draggedPiece,
      position: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    };
    
    setDraggedPiece(updatedPiece);
  };

  const handleGlobalPointerUp = () => {
    if (draggedPiece) {
      onPieceInteraction?.(draggedPiece, 'drop');
      setDraggedPiece(null);
    }
    
    document.removeEventListener('pointermove', handleGlobalPointerMove);
    document.removeEventListener('pointerup', handleGlobalPointerUp);
  };

  const renderCakeSlices = () => {
    const slices = [];
    const anglePerSlice = 360 / fraction.denominator;
    
    for (let i = 0; i < fraction.denominator; i++) {
      const startAngle = i * anglePerSlice;
      const endAngle = (i + 1) * anglePerSlice;
      const isHighlighted = i < fraction.numerator;
      
      const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
      const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
      const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
      const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = anglePerSlice > 180 ? 1 : 0;
      const pathData = `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} Z`;
      
      slices.push(
        <path
          key={`slice_${i}`}
          d={pathData}
          fill={isHighlighted ? 'hsl(var(--fraction-cake))' : 'hsl(var(--fraction-plate))'}
          stroke="white"
          strokeWidth="2"
          className={`transition-all duration-300 ${
            interactive && isHighlighted ? 'fraction-piece cursor-grab hover:brightness-110' : ''
          }`}
          onPointerDown={interactive && isHighlighted ? (e) => handlePointerDown(e, pieces[i]) : undefined}
        />
      );
    }
    
    return slices;
  };

  const renderPizzaSlices = () => {
    return renderCakeSlices(); // Similar implementation
  };

  const renderLaddus = () => {
    const laddus = [];
    const cols = Math.ceil(Math.sqrt(fraction.denominator));
    const size = 80 / cols;
    
    for (let i = 0; i < fraction.denominator; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = col * (size + 4) + 10;
      const y = row * (size + 4) + 10;
      const isHighlighted = i < fraction.numerator;
      
      laddus.push(
        <circle
          key={`laddu_${i}`}
          cx={x + size / 2}
          cy={y + size / 2}
          r={size / 2 - 2}
          fill={isHighlighted ? 'hsl(var(--fraction-laddu))' : 'hsl(var(--fraction-plate))'}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          className={`transition-all duration-300 ${
            interactive && isHighlighted ? 'fraction-piece cursor-grab hover:brightness-110' : ''
          }`}
          onPointerDown={interactive && isHighlighted ? (e) => handlePointerDown(e, pieces[i]) : undefined}
        />
      );
    }
    
    return laddus;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative w-full h-48 game-card p-4">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
          {type === 'cake' && renderCakeSlices()}
          {type === 'pizza' && renderPizzaSlices()}
          {type === 'laddus' && renderLaddus()}
        </svg>
        
        {/* Dragged piece overlay */}
        {draggedPiece && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: draggedPiece.position.x - 20,
              top: draggedPiece.position.y - 20,
              transform: 'scale(1.1) rotate(5deg)'
            }}
          >
            <div className="w-10 h-10 bg-fraction-cake rounded-full shadow-lg opacity-80"></div>
          </div>
        )}
      </div>
      
      {/* Fraction Display */}
      <div className="text-center mt-4">
        <div className="text-2xl font-bold text-game-primary">
          {FractionMath.formatFraction(fraction)}
        </div>
        {FractionMath.isImproper(fraction) && (
          <div className="text-sm text-gray-600">
            = {FractionMath.formatMixedNumber(FractionMath.toMixedNumber(fraction))}
          </div>
        )}
      </div>
    </div>
  );
};

// Drop zone for receiving pieces
interface DropZoneProps {
  zone: DropZone;
  onDrop: (item: DragItem, zone: DropZone) => void;
  children?: React.ReactNode;
  className?: string;
}

export const DroppableZone: React.FC<DropZoneProps> = ({
  zone,
  onDrop,
  children,
  className = ""
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsActive(true);
  };

  const handleDragLeave = () => {
    setIsActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsActive(false);
    // Handle drop logic here
  };

  return (
    <div
      className={`drop-zone ${isActive ? 'active' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Items in this zone */}
      <div className="flex flex-wrap gap-2 mt-2">
        {zone.items.map((item, index) => (
          <div
            key={`${item.id}_${index}`}
            className="w-8 h-8 bg-fraction-cake rounded-full shadow-sm"
          />
        ))}
      </div>
      
      {/* Zone label */}
      <div className="text-sm text-gray-500 mt-2">
        {zone.type === 'plate' && `Friend ${zone.id}`}
        {zone.type === 'friend' && `Friend ${zone.id}`}
        {zone.type === 'fraction-builder' && 'Fraction Builder'}
      </div>
    </div>
  );
};