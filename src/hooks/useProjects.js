import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchProjects, fetchProjectImages } from '../services/rssParser';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prefetched = useRef(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjects();
      setProjects(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      setProjects([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().then((data) => {
      if (data.length > 0 && !prefetched.current) {
        prefetched.current = true;
        prefetchImages(data, setProjects);
      }
    });
  }, [load]);

  return { projects, loading, error, retry: () => { prefetched.current = false; load(); } };
}

async function prefetchImages(projects, setProjects) {
  for (let i = 0; i < projects.length; i++) {
    await new Promise((r) => setTimeout(r, 300));
    try {
      const images = await fetchProjectImages(projects[i].link);
      if (images.length > 1) {
        setProjects((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, images } : p
          )
        );
      }
    } catch {
      // silently skip if a project page fails
    }
  }
}
