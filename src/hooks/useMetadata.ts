import { useEffect } from "react";

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogImage?: string;
  favicon?: string;
}

/**
 * Hook para gerenciar metadados da página.
 * @param {Object} options - Opções de metadados.
 * @param {string} options.title - Título da página.
 * @param {string} options.description - Descrição da página.
 * @param {string} options.keywords - Palavras-chave da página.
 * @param {string} options.ogTitle - Título Open Graph.
 * @param {string} options.ogImage - Imagem Open Graph.
 * @param {string} options.favicon - URL do favicon.
 */
export function useMetadata({
  title,
  description,
  keywords,
  ogTitle,
  ogImage,
  favicon,
}: MetadataOptions) {
  useEffect(() => {
    const setMetaTag = (name: string, content: string | undefined) => {
      if (!content) return;
      let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    if (title) document.title = title;
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setMetaTag("og:title", ogTitle);
    setMetaTag("og:image", ogImage);

    if (favicon) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png"; 
        document.head.appendChild(link);
      }
      link.href = favicon;
    }
  }, [title, description, keywords, ogTitle, ogImage, favicon]);
}