import { useState, useRef, useEffect } from 'react';
import { FiExternalLink } from 'react-icons/fi';

export default function ProjectCard({ project, index }) {
  const { title, link, thumbnail, images = [], date } = project;

  const pool = [thumbnail, ...images].filter(Boolean);
  const hasSlideshow = pool.length > 1;

  const [hovered, setHovered] = useState(false);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!hovered || !hasSlideshow) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % pool.length);
    }, 2200);

    return () => clearInterval(intervalRef.current);
  }, [hovered, hasSlideshow, pool.length]);

  useEffect(() => {
    if (!hovered) {
      setCurrent(0);
      clearInterval(intervalRef.current);
    }
  }, [hovered]);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden bg-white dark:bg-primary-900/50 border border-primary-800/5 dark:border-secondary-50/5 hover:border-primary-800/20 dark:hover:border-secondary-50/20 hover:-translate-y-1 transition-all duration-500 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE SLIDER */}
      <div className="relative aspect-[4/3] overflow-hidden bg-primary-800/5 dark:bg-primary-950/50">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            width: `${pool.length * 100}%`,
            transform: `translateX(-${current * (100 / pool.length)}%)`,
          }}
        >
          {pool.map((img, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0"
              style={{ width: `${100 / pool.length}%` }}
            >
              <img
                src={img}
                alt={`${title}-${i}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        {hasSlideshow && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {pool.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-white w-2.5 h-2.5'
                    : 'bg-white/40 w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5">
        <h3 className="font-display text-base sm:text-lg font-semibold text-primary-800 dark:text-secondary-50 group-hover:text-primary-600 dark:group-hover:text-secondary-200 transition-colors duration-300 line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-primary-800/40 dark:text-secondary-50/40">
            {date || 'Recent'}
          </span>

          <FiExternalLink
            size={14}
            className="text-primary-800/30 dark:text-secondary-50/30 group-hover:text-primary-800 dark:group-hover:text-secondary-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </a>
  );
}