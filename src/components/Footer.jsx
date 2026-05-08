import { FiHeart, FiExternalLink } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-800/5 dark:border-secondary-50/10 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-primary-800/40 dark:text-secondary-50/40">
          &copy; {year} Rana Sherif. All rights reserved.
        </p>
        <p className="text-xs text-primary-800/40 dark:text-secondary-50/40 flex items-center gap-1.5">
          Made with <FiHeart size={10} className="text-red-400" /> and lots of coffee
        </p>
        <p className="text-xs text-primary-800/40 dark:text-secondary-50/40 flex items-center gap-1.5">
          Developed by
          <a
            href="https://ahmed-emara-portfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-800 dark:hover:text-secondary-50 transition-colors duration-300 inline-flex items-center gap-1"
          >
            Ahmed Emara
            <FiExternalLink size={12} />
          </a>
        </p>
        
      </div>
    </footer>
  );
}
