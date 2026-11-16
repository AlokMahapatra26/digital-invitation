import confetti from 'canvas-confetti';

export function useConfetti() {
  const shootPetals = () => {
    // Rose petal colors
    const colors = ['#e63946', '#ff758f', '#ffb3c1', '#d4af37'];
    
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.6 },
      colors,
      shapes: ['circle'],
      scalar: 1.2,
      ticks: 200,
      gravity: 0.8,
    });

    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.6 },
      colors,
      shapes: ['circle'],
      scalar: 1.2,
      ticks: 200,
      gravity: 0.8,
    });
  };

  const shootGoldDust = () => {
    const goldColors = ['#d4af37', '#ffd700', '#fff2b2', '#c59b27'];

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: goldColors,
      disableForReducedMotion: true,
      gravity: 0.6,
      scalar: 1.1,
    });
  };

  const shootHearts = () => {
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#c9184a', '#ff8fa3'],
      shapes: ['circle'],
      gravity: 0.7,
    });
  };

  return {
    shootPetals,
    shootGoldDust,
    shootHearts,
  };
}
