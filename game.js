const { useState, useEffect, useRef } = React;

const VirtualJoystick = ({ onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const basePosition = useRef({ x: 0, y: 0 });

  const handleStart = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    basePosition.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    setIsDragging(true);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;

    const dx = clientX - basePosition.current.x;
    const dy = clientY - basePosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 40;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      const x = Math.cos(angle) * maxDistance;
      const y = Math.sin(angle) * maxDistance;
      setPosition({ x, y });
      onMove({ x: x / maxDistance, y: y / maxDistance });
    } else {
      setPosition({ x: dx, y: dy });
      onMove({ x: dx / maxDistance, y: dy / maxDistance });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;

    const touchStart = (e) => {
      e.preventDefault();
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const touchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const touchEnd = (e) => {
      e.preventDefault();
      handleEnd();
    };

    container.addEventListener('touchstart', touchStart);
    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', touchEnd);

    return () => {
      container.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
    };
  }, [isDragging]);

  return React.createElement('div', {
    ref: containerRef,
    className: "relative w-32 h-32 bg-gray-800 rounded-full touch-none"
  }, 
    React.createElement('div', {
      className: "absolute w-16 h-16 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-80",
      style: { 
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
      }
    })
  );
};

const ElasticParticleGame = () => {
  const canvasRef = useRef(null);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const particlesRef = useRef([]);
  const targetsRef = useRef([]);
  const zonesRef = useRef([]);
  const requestIdRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Create particles cluster
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height / 2 + (Math.random() - 0.5) * 60,
        vx: 0,
        vy: 0,
        baseX: canvas.width / 2,
        baseY: canvas.height / 2,
        radius: 2 + Math.random() * 2
      });
    }

    // Create target orbs to push
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
    colors.forEach((color, i) => {
      const angle = (Math.PI * 2 / colors.length) * i;
      targetsRef.current.push({
        x: canvas.width / 2 + Math.cos(angle) * 100,
        y: canvas.height / 2 + Math.sin(angle) * 100,
        vx: 0,
        vy: 0,
        radius: 15,
        color: color,
        matched: false
      });

      const zoneAngle = angle + Math.PI;
      zonesRef.current.push({
        x: canvas.width / 2 + Math.cos(zoneAngle) * 150,
        y: canvas.height / 2 + Math.sin(zoneAngle) * 150,
        radius: 30,
        color: color
      });
    });

    // Handle keyboard input
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowUp':
          setDirection(prev => ({ ...prev, y: -1 }));
          break;
        case 'ArrowDown':
          setDirection(prev => ({ ...prev, y: 1 }));
          break;
        case 'ArrowLeft':
          setDirection(prev => ({ ...prev, x: -1 }));
          break;
        case 'ArrowRight':
          setDirection(prev => ({ ...prev, x: 1 }));
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch(e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          setDirection(prev => ({ ...prev, y: 0 }));
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          setDirection(prev => ({ ...prev, x: 0 }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleJoystickMove = ({ x, y }) => {
    setDirection({ x, y });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const checkCollisions = () => {
      targetsRef.current.forEach(target => {
        if (target.matched) return;

        particlesRef.current.forEach(particle => {
          const dx = target.x - particle.x;
          const dy = target.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < target.radius + particle.radius) {
            const angle = Math.atan2(dy, dx);
            const force = 0.5;
            target.vx += Math.cos(angle) * force;
            target.vy += Math.sin(angle) * force;
          }
        });

        zonesRef.current.forEach((zone, index) => {
          if (target.color === zone.color) {
            const dx = target.x - zone.x;
            const dy = target.y - zone.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < zone.radius && !target.matched) {
              target.matched = true;
              setScore(prev => prev + 100);
            }
          }
        });
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw zones
      zonesRef.current.forEach(zone => {
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fillStyle = zone.color + '33';
        ctx.fill();
        ctx.strokeStyle = zone.color;
        ctx.stroke();
      });

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        const targetX = particle.baseX + direction.x * 100;
        const targetY = particle.baseY + direction.y * 100;

        const springForceX = (targetX - particle.x) * 0.1;
        const springForceY = (targetY - particle.y) * 0.1;

        particle.vx = (particle.vx + springForceX) * 0.95;
        particle.vy = (particle.vy + springForceY) * 0.95;

        particle.vx += (Math.random() - 0.5) * 0.3;
        particle.vy += (Math.random() - 0.5) * 0.3;

        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(65, 105, 225, ${0.7 + Math.random() * 0.3})`;
        ctx.fill();
      });

      // Update and draw target orbs
      targetsRef.current.forEach(target => {
        if (!target.matched) {
          target.vx *= 0.98;
          target.vy *= 0.98;

          target.x += target.vx;
          target.y += target.vy;

          if (target.x - target.radius < 0 || target.x + target.radius > canvas.width) {
            target.vx *= -0.8;
            target.x = Math.max(target.radius, Math.min(canvas.width - target.radius, target.x));
          }
          if (target.y - target.radius < 0 || target.y + target.radius > canvas.height) {
            target.vy *= -0.8;
            target.y = Math.max(target.radius, Math.min(canvas.height - target.radius, target.y));
          }
        }

        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = target.matched ? target.color + '66' : target.color;
        ctx.fill();
      });

      checkCollisions();

      if (!gameWon && targetsRef.current.every(target => target.matched)) {
        setGameWon(true);
      }

      requestIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, [direction, gameWon]);

  return React.createElement('div', { 
    className: "flex flex-col items-center gap-4 touch-none" 
  }, [
    React.createElement('div', { 
      key: 'score',
      className: "text-xl font-bold text-blue-600" 
    }, `Score: ${score}`),
    React.createElement('canvas', {
      key: 'canvas',
      ref: canvasRef,
      width: 400,
      height: 400,
      className: "bg-gray-900 rounded-lg"
    }),
    React.createElement(VirtualJoystick, {
      key: 'joystick',
      onMove: handleJoystickMove
    }),
    React.createElement('div', {
      key: 'message',
      className: "text-sm text-gray-600 text-center"
    }, gameWon ? 
      React.createElement('div', {
        className: "text-green-500 font-bold"
      }, "You won! All orbs matched!") :
      React.createElement('div', null, 
        "Use the joystick to move the particle cluster and push the colored orbs to their matching zones!"
      )
    )
  ]);
};

// Export for use in HTML
window.ElasticParticleGame = ElasticParticleGame;
