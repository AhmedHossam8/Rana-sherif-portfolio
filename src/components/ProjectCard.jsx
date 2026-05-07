import { useState, useRef, useEffect, useCallback } from 'react';
import { FiExternalLink } from 'react-icons/fi';

export default function ProjectCard({ project, index }) {
  const { title, link, thumbnail, images = [], date } = project;
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef(null);

  const pool = images.length > 1 ? [thumbnail, ...images] : [thumbnail];
  const hasSlideshow = pool.length > 1;
  const currentImage = pool[hoverIndex % pool.length] || thumbnail;

  const startSlideshow = useCallback(() => {
    if (pool.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setHoverIndex((prev) => (prev + 1) % pool.length);
    }, 2000);
  }, [pool.length]);

  const stopSlideshow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setHoverIndex(0);
  }, []);

  useEffect(() => {
    if (isHovered) {
      startSlideshow();
    } else {
      stopSlideshow();
    }
    return () => stopSlideshow();
  }, [isHovered, startSlideshow, stopSlideshow]);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-shadow rounded-2xl overflow-hidden bg-white dark:bg-primary-900/50 border border-primary-800/5 dark:border-secondary-50/5 hover:border-primary-800/20 dark:hover:border-secondary-50/20 hover:-translate-y-1 transition-all duration-500 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-primary-800/5 dark:bg-primary-950/50">
        {!loaded && (
          <div className="absolute inset-0 bg-primary-800/5 dark:bg-primary-950/50 animate-skeleton" />
        )}
        <img
          key={currentImage}
          src={currentImage}
          alt={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transition: 'opacity 0.4s ease, transform 0.5s ease',
          }}
        />

        {hasSlideshow && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {pool.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === (hoverIndex % pool.length)
                    ? 'bg-white w-2.5 h-2.5'
                    : 'bg-white/40 w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

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
