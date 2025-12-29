import { useEffect, useState } from "react";

export interface Project {
  title: string;
  description: string;
  tags?: string[];
  links?: { github?: string; demo?: string };
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadProjects() {
        try {
          setLoading(true);
          setError(null);
      
          const apiBase = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:5000";
          const res = await fetch(`${apiBase}/api/projects`);
      
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data: Project[] = await res.json();
          if (!cancelled) setProjects(data);
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
          if (!cancelled) setLoading(false);
        }
      }      
    loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div>Loading projects…</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="projects-section py-8">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.title}
            className="border border-gray-700 rounded-xl p-4 bg-gray-800"
          >
            <h3 className="text-xl font-bold">{p.title}</h3>
            <p className="text-gray-300 mt-2">{p.description}</p>
            {p.tags && (
              <ul className="flex flex-wrap mt-2 space-x-2">
                {p.tags.map((tag) => (
                  <li
                    key={tag}
                    className="px-2 py-1 bg-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {p.links && (
              <div className="flex space-x-4 mt-3">
                {p.links.github && (
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    GitHub
                  </a>
                )}
                {p.links.demo && (
                  <a
                    href={p.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    Demo
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
