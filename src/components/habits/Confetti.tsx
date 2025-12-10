import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    if (active) {
      const colors = [
        'hsl(var(--primary))',
        'hsl(var(--success))',
        'hsl(var(--warning))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
      ];
      
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: '-10px',
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
