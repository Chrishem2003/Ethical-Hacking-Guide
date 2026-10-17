import React, { useState } from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  title: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title }) => {
  const [hasError, setHasError] = useState(false);

  // Extract YouTube ID
  const getEmbedUrl = (rawUrl: string): string | null => {
    if (!rawUrl) return null;

    try {
      if (rawUrl.includes('youtube.com/watch?v=')) {
        const id = rawUrl.split('v=')[1]?.split('&')[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (rawUrl.includes('youtu.be/')) {
        const id = rawUrl.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (rawUrl.includes('youtube.com/playlist?list=')) {
        const list = rawUrl.split('list=')[1]?.split('&')[0];
        return list ? `https://www.youtube-nocookie.com/embed/videoseries?list=${list}` : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl || hasError) {
    return (
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-200">Verified Video Masterclass</div>
            <div className="text-xs text-neutral-400 truncate max-w-sm">{title}</div>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch on YouTube</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-xl">
      <div className="aspect-video w-full bg-black relative">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setHasError(true)}
          className="w-full h-full border-0"
        />
      </div>
      <div className="p-3 bg-neutral-950/90 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800">
        <span className="font-medium text-neutral-300 truncate max-w-md">🎥 Video Briefing: {title}</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="hover:text-neutral-200 flex items-center gap-1 shrink-0 text-[11px]"
        >
          <span>Open Fullscreen</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
