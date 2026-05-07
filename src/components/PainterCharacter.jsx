import { useRef, useState, useEffect } from 'react';

const PAINT_STROKES = [
  { d: 'M162 176 Q188 155 215 172', color: '#FF6B6B', w: 4, start: 0.5 },
  { d: 'M160 180 Q185 200 212 190', color: '#4ECDC4', w: 3.5, start: 1.8 },
  { d: 'M163 178 Q188 175 200 183 Q196 190 180 187', color: '#FFE66D', w: 3, start: 3.0 },
  { d: 'M161 179 Q186 166 210 178', color: '#A06CD5', w: 3, start: 4.2 },
  { d: 'M162 183 Q188 190 208 186', color: '#FF9F1C', w: 3, start: 5.4 },
];

const PAINT_DOTS = [
  { cx: 215, cy: 172, r: 3, color: '#FF6B6B', start: 6.0 },
  { cx: 212, cy: 193, r: 2.5, color: '#4ECDC4', start: 6.3 },
  { cx: 180, cy: 170, r: 2, color: '#FFE66D', start: 6.1 },
  { cx: 178, cy: 190, r: 2, color: '#A06CD5', start: 6.5 },
  { cx: 208, cy: 180, r: 2.5, color: '#FF9F1C', start: 6.2 },
  { cx: 170, cy: 178, r: 1.5, color: '#2EC4B6', start: 6.7 },
  { cx: 200, cy: 178, r: 2, color: '#FF6B6B', start: 6.4 },
];

const CYCLE = 12;
const DRAW_DUR = 1.0;
const SHOW_END = 9.0;
const FADE_END = 10.5;

export default function PainterCharacter() {
  const ref = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [show, setShow] = useState(false);
  const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setShow(true);
    const onMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      posRef.current = {
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      };
    };
    const onLeave = () => {
      posRef.current = { x: 0, y: 0 };
    };

    const tick = () => {
      setDisplayPos((prev) => {
        const t = posRef.current;
        const smoothX = prev.x + (t.x - prev.x) * 0.12;
        const smoothY = prev.y + (t.y - prev.y) * 0.12;
        if (Math.abs(smoothX - t.x) < 0.001 && Math.abs(smoothY - t.y) < 0.001) {
          return t;
        }
        return { x: smoothX, y: smoothY };
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const headRotate = displayPos.x * 8;
  const eyeOffsetX = displayPos.x * 3;
  const eyeOffsetY = displayPos.y * 2;

  return (
    <div
      ref={ref}
      className="select-none"
      style={{
        width: 220,
        height: 300,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.7)',
        transition: 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <svg
        viewBox="0 0 220 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 8px 32px rgba(76,0,0,0.12))',
          willChange: 'transform',
        }}
      >
        <g>
          {/* Floating animation */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-6; 0,0"
            dur="4s"
            repeatCount="indefinite"
          />

          {/* Background splatters — staggered entrance */}
          {[
            { cx: 40, cy: 220, r: 8, color: '#FF6B6B', delay: 0.3 },
            { cx: 180, cy: 240, r: 6, color: '#4ECDC4', delay: 0.5 },
            { cx: 30, cy: 150, r: 5, color: '#FFE66D', delay: 0.4 },
            { cx: 190, cy: 160, r: 7, color: '#A06CD5', delay: 0.6 },
          ].map((s) => (
            <circle key={s.cx + '' + s.cy} cx={s.cx} cy={s.cy} r={s.r} fill={s.color} opacity="0">
              <animate attributeName="opacity" from="0" to="0.3" begin={`${s.delay}s`} dur="0.5s" fill="freeze" />
              <animate attributeName="r" values={`${s.r};${s.r + 4};${s.r}`} dur={`${3 + s.delay}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Shadow under character */}
          <ellipse cx="110" cy="268" rx="40" ry="6" fill="rgba(0,0,0,0.08)">
            <animate attributeName="rx" values="40;36;40" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.08;0.05;0.08" dur="4s" repeatCount="indefinite" />
          </ellipse>

          {/* Body */}
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" begin="0.2s" dur="0.6s" fill="freeze" />
            <animateTransform attributeName="transform" type="translate" from="0 12" to="0 0" begin="0.2s" dur="0.6s" fill="freeze" />

            <path
              d="M85 140 Q80 150 78 180 Q76 220 80 250 Q82 260 90 265 L130 265 Q138 260 140 250 Q144 220 142 180 Q140 150 135 140 Z"
              fill="#F5F0E8"
              stroke="#E8E0D0"
              strokeWidth="1"
            />
            <path d="M95 140 Q110 150 125 140" stroke="#D4CAB8" strokeWidth="2" fill="none" />

            {/* Body splatters — staggered */}
            {[
              { cx: 100, cy: 180, r: 10, color: '#FF6B6B', delay: 0.4 },
              { cx: 120, cy: 200, r: 8, color: '#4ECDC4', delay: 0.5 },
              { cx: 95, cy: 215, r: 6, color: '#FFE66D', delay: 0.45 },
              { cx: 125, cy: 175, r: 7, color: '#A06CD5', delay: 0.55 },
              { cx: 108, cy: 235, r: 9, color: '#FF9F1C', delay: 0.6 },
              { cx: 115, cy: 165, r: 5, color: '#2EC4B6', delay: 0.35 },
              { cx: 88, cy: 195, r: 4, color: '#E71D36', delay: 0.5 },
              { cx: 135, cy: 220, r: 5, color: '#FF6B6B', delay: 0.65 },
              { cx: 105, cy: 250, r: 4, color: '#4ECDC4', delay: 0.7 },
            ].map((s, i) => (
              <g key={i} opacity="0">
                <animate attributeName="opacity" from="0" to="1" begin={`${s.delay}s`} dur="0.3s" fill="freeze" />
                <circle cx={s.cx} cy={s.cy} r={s.r} fill={s.color} opacity={s.color === '#011627' ? 0.8 : 0.75} />
              </g>
            ))}

            {/* Drips */}
            <path d="M100 190 Q99 200 101 205" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M120 208 Q121 218 119 222" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M108 244 Q107 252 109 256" stroke="#FF9F1C" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Right arm */}
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" begin="0.5s" dur="0.4s" fill="freeze" />
            <path
              d="M135 155 Q150 160 162 175 Q168 182 170 190"
              stroke="#E8D5C4"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="170" cy="190" r="7" fill="#F0DCC8" />

            {/* Paintbrush */}
            <g transform="rotate(-30, 170, 190)">
              <rect x="166" y="175" width="8" height="30" rx="2" fill="#8B6914" />
              <rect x="166" y="170" width="8" height="8" rx="1" fill="#C0A060" />
              <path d="M167 170 L173 170 L175 162 L165 162 Z" fill="#FF6B6B" />
              <circle cx="170" cy="164" r="2" fill="#FF6B6B" opacity="0.7">
                <animate attributeName="cy" values="164;172;164" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>

          {/* Left arm */}
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="0.7" begin="0.45s" dur="0.4s" fill="freeze" />
            <path d="M85 155 Q70 162 60 175" stroke="#E8D5C4" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7" />
          </g>

          {/* Neck */}
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" begin="0.3s" dur="0.4s" fill="freeze" />
            <rect x="102" y="128" width="16" height="16" rx="3" fill="#F0DCC8" />
          </g>

          {/* Head — entrance layer */}
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" begin="0.15s" dur="0.5s" fill="freeze" />
            <animateTransform attributeName="transform" type="translate" from="0 15" to="0 0" begin="0.15s" dur="0.5s" fill="freeze" />

            {/* Head — mouse tracking layer */}
            <g
              style={{
                transformOrigin: '110px 115px',
                transform: `rotate(${headRotate}deg)`,
                transition: 'transform 0.1s linear',
              }}
            >
              <ellipse cx="110" cy="100" rx="32" ry="36" fill="#F5E1CC" />
              <ellipse cx="88" cy="108" rx="7" ry="4" fill="#FFB5B5" opacity="0.4" />
              <ellipse cx="132" cy="108" rx="7" ry="4" fill="#FFB5B5" opacity="0.4" />

              {/* Beret */}
              <ellipse cx="110" cy="68" rx="36" ry="12" fill="#2C2C2C" />
              <path d="M80 68 Q82 50 110 46 Q138 50 140 68" fill="#2C2C2C" />
              <circle cx="110" cy="46" r="5" fill="#2C2C2C" />
              <ellipse cx="100" cy="62" rx="12" ry="4" fill="#404040" opacity="0.5" />
              <circle cx="95" cy="65" r="3" fill="#FF6B6B" opacity="0.7" />
              <circle cx="120" cy="63" r="2.5" fill="#4ECDC4" opacity="0.7" />
              <circle cx="108" cy="60" r="2" fill="#FFE66D" opacity="0.7" />

              {/* Eyes */}
              <ellipse cx="98" cy="95" rx="8" ry="9" fill="white" stroke="#D4C0A0" strokeWidth="0.5" />
              <circle cx={98 + eyeOffsetX} cy={95 + eyeOffsetY} r="4.5" fill="#2C2C2C" />
              <circle cx={99 + eyeOffsetX} cy={93 + eyeOffsetY} r="1.5" fill="white" />

              <ellipse cx="122" cy="95" rx="8" ry="9" fill="white" stroke="#D4C0A0" strokeWidth="0.5" />
              <circle cx={122 + eyeOffsetX} cy={95 + eyeOffsetY} r="4.5" fill="#2C2C2C" />
              <circle cx={123 + eyeOffsetX} cy={93 + eyeOffsetY} r="1.5" fill="white" />

              {/* Eyebrows */}
              <path d="M90 85 Q95 82 103 84" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M117 84 Q125 82 130 85" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* Nose */}
              <path d="M108 100 Q110 104 112 100" stroke="#D4B898" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* Smile */}
              <path d="M100 112 Q105 118 110 118 Q115 118 120 112" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" fill="none">
                <animate attributeName="d" values="M100 112 Q105 118 110 118 Q115 118 120 112;M100 111 Q105 119 110 119 Q115 119 120 111;M100 112 Q105 118 110 118 Q115 118 120 112" dur="4s" repeatCount="indefinite" />
              </path>
            </g>
          </g>

          {/* Paint strokes animation — cycles painting and erasing */}
          <g>
            {PAINT_STROKES.map((s) => {
              const dk = s.start / CYCLE;
              const ek = (s.start + DRAW_DUR) / CYCLE;
              const fk = FADE_END / CYCLE;
              const snap = Math.min(fk + 0.005, 0.995);
              return (
                <path
                  key={s.d}
                  d={s.d}
                  stroke={s.color}
                  strokeWidth={s.w}
                  fill="none"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  opacity="0"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="1;1;0;0;1;1"
                    keyTimes={`0;${dk};${ek};${fk};${snap};1`}
                    dur={`${CYCLE}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0;0;0"
                    keyTimes={`0;${dk};${ek};${fk};${snap};1`}
                    dur={`${CYCLE}s`}
                    repeatCount="indefinite"
                  />
                </path>
              );
            })}

            {PAINT_DOTS.map((d) => {
              const dk = d.start / CYCLE;
              const ek = (d.start + 0.3) / CYCLE;
              const fk = FADE_END / CYCLE;
              const snap = Math.min(fk + 0.005, 0.995);
              return (
                <circle
                  key={`${d.cx}-${d.cy}`}
                  cx={d.cx}
                  cy={d.cy}
                  r="0"
                  fill={d.color}
                >
                  <animate
                    attributeName="r"
                    values={`0;0;${d.r};${d.r};0;0`}
                    keyTimes={`0;${dk};${ek};${fk};${snap};1`}
                    dur={`${CYCLE}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
