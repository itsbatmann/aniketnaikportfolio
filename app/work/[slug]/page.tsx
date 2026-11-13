import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import Contact from "@/components/Contact";
import { PROJECTS, getProject } from "@/lib/projects";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  // The one-line summary is too thin to serve as a search snippet on its own,
  // so the description is built from the line plus the first paragraph of the
  // case copy and clipped to roughly what Google will display.
  const description = `${project.line} ${project.overview[0] ?? ""}`
    .trim()
    .slice(0, 300);
  const url = `/work/${project.slug}`;

  return {
    // Bare title — the root layout's template appends the site name.
    title: `${project.title} — ${project.scope} case study`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — ${SITE.name}`,
      description,
    },
    twitter: {
      title: `${project.title} — ${SITE.name}`,
      description,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  return (
    <main>
      <ProjectDetail
        project={PROJECTS[index]}
        next={PROJECTS[(index + 1) % PROJECTS.length]}
      />
      <Contact />
    </main>
  );
}
