import React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "TaskFlow | Project Management System",
  description = "TaskFlow is a project management platform that helps teams organize projects, manage tasks, assign members, track progress, and improve productivity.",
  keywords = "TaskFlow, project management, task management, team collaboration, productivity, projects, tasks, workflow, dashboard",
  image = "https://my-domain.com/taskflow-preview.png",
  url = "https://my-domain.com",
}) => {
  return (
    <Helmet>
      {/* General */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="TaskFlow" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TaskFlow" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Theme */}
      <meta name="theme-color" content="#2563eb" />
    </Helmet>
  );
};

export default SEO;