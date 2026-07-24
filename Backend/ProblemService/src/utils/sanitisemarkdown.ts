import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown"

import logger from "../config/logger.config";

const turndownService = new TurndownService();

export const sanitizeMarkdown = async (
  markdown: string
): Promise<string> => {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  try {
    // Markdown -> HTML
    const html = await marked.parse(markdown);

    // Sanitize HTML
    const sanitizedHtml = sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "pre",
        "code",
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "title"],
        code: ["class"],
        pre: ["class"],
        a: ["href", "target"],
      },
      allowedSchemes: ["http", "https"],
      allowedSchemesByTag: {
        img: ["http", "https"],
      },
    });

    // HTML -> Markdown
    return turndownService.turndown(sanitizedHtml);
  } catch (error) {
    logger.error("Error sanitizing markdown", error);

    throw new Error("Failed to sanitize markdown");
  }
};