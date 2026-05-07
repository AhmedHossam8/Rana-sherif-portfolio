import { FiLinkedin, FiGithub, FiArrowDown } from 'react-icons/fi';
import { FaBehance, FaDribbble } from 'react-icons/fa';
import PainterCharacter from './PainterCharacter';

const socialLinks = [
  { icon: FaBehance, href: 'https://www.behance.net/ranasherif10', label: 'Behance' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaDribbble, href: '#', label: 'Dribbble' },
  { icon: FiGithub, href: 'https://github.com/AhmedHossam8', label: 'GitHub' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-800/3 dark:bg-secondary-50/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-800/5 dark:bg-secondary-50/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="text-center lg:text-left animate-fade-in">
          <p className="inline-block text-xs font-medium uppercase tracking-[0.3em] text-primary-800/50 dark:text-secondary-50/50 mb-4 lg:mb-6">
            UI/UX Designer
          </p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-800 dark:text-secondary-50 leading-[1.1] mb-4 lg:mb-6 text-balance">
            Rana
            <span className="block text-primary-800/30 dark:text-secondary-50/30">Sherif</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-primary-800/60 dark:text-secondary-50/60 max-w-lg mx-auto lg:mx-0 mb-8 lg:mb-10 leading-relaxed">
            Crafting intuitive and delightful digital experiences
            through thoughtful UI/UX design. Passionate about creating
            products that make a difference.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-3 lg:gap-4 mb-10 lg:mb-12">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="p-2.5 lg:p-3 rounded-full border border-primary-800/10 dark:border-secondary-50/10 text-primary-800/60 dark:text-secondary-50/60 hover:text-primary-800 dark:hover:text-secondary-50 hover:border-primary-800/30 dark:hover:border-secondary-50/30 hover:bg-primary-800/5 dark:hover:bg-secondary-50/5 transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-primary-800 text-white dark:bg-secondary-50 dark:text-primary-950 text-sm font-medium hover:bg-primary-900 dark:hover:bg-secondary-200 transition-all duration-300 shadow-lg shadow-primary-800/20 dark:shadow-secondary-50/10"
          >
            View Projects
            <FiArrowDown size={14} className="animate-bounce" />
          </a>
        </div>

        <div className="flex justify-center lg:justify-end animate-fade-in">
          <div className="relative">
            <PainterCharacter />
          </div>
        </div>
      </div>
    </section>
  );
}
