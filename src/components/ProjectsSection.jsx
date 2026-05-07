import { useProjects } from '../hooks/useProjects';
import ProjectCard from './ProjectCard';
import Skeleton from './Skeleton';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

export default function ProjectsSection() {
  const { projects, loading, error, retry } = useProjects();

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-14 sm:mb-18 animate-fade-in">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary-800/50 dark:text-secondary-50/50 mb-4">
          Portfolio
        </p>
        <h2 className="section-heading text-primary-800 dark:text-secondary-50">
          Selected Projects
        </h2>
        <p className="mt-4 text-sm sm:text-base text-primary-800/60 dark:text-secondary-50/60 max-w-md mx-auto">
          A collection of design projects showcasing my passion for user-centered design
        </p>
      </div>

      {loading && <Skeleton />}

      {error && (
        <div className="text-center py-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 mb-6">
            <FiAlertCircle size={24} className="text-red-500" />
          </div>
          <h3 className="font-display text-xl font-semibold text-primary-800 dark:text-secondary-50 mb-2">
            Unable to load projects
          </h3>
          <p className="text-sm text-primary-800/60 dark:text-secondary-50/60 mb-6 max-w-sm mx-auto">
            {error}
          </p>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-800 text-white dark:bg-secondary-50 dark:text-primary-950 text-sm font-medium hover:bg-primary-900 dark:hover:bg-secondary-200 transition-all duration-300"
          >
            <FiRefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-primary-800/60 dark:text-secondary-50/60">
            No projects found. Check back later.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.link + index} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
