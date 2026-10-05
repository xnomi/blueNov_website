"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LibraryShelf = "reading" | "plan_to_read" | "completed" | "favorites";

export interface NovelProgress {
  novelSlug: string;
  novelTitle: string;
  novelCover?: string;
  author?: string;
  lastChapterSlug: string;
  lastChapterNumber: number;
  lastChapterTitle: string;
  totalChapters?: number;
  percent: number;
  scrollPosition?: number;
  updatedAt: string;
}

export interface LibraryItem {
  novelId?: string;
  title: string;
  slug: string;
  cover_url?: string;
  author?: string;
  genre?: string;
  shelf: LibraryShelf;
  addedAt: string;
}

interface ReadingProgressState {
  progress: Record<string, NovelProgress>;
  library: Record<string, LibraryItem>;

  // Actions
  saveProgress: (progress: NovelProgress) => void;
  getProgress: (novelSlug: string) => NovelProgress | undefined;
  setShelf: (item: Omit<LibraryItem, "addedAt">) => void;
  removeFromLibrary: (slug: string) => void;
  clearHistory: () => void;
  getRecentProgress: () => NovelProgress[];
  getLibraryByShelf: (shelf: LibraryShelf) => LibraryItem[];
}

export const useReadingProgress = create<ReadingProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      library: {},

      saveProgress: (newProgress) => {
        set((state) => {
          const updated = {
            ...state.progress,
            [newProgress.novelSlug]: {
              ...newProgress,
              updatedAt: new Date().toISOString(),
            },
          };

          // Also automatically put into "reading" shelf in library if not set
          const library = { ...state.library };
          if (!library[newProgress.novelSlug]) {
            library[newProgress.novelSlug] = {
              title: newProgress.novelTitle,
              slug: newProgress.novelSlug,
              cover_url: newProgress.novelCover,
              author: newProgress.author,
              shelf: "reading",
              addedAt: new Date().toISOString(),
            };
          }

          return { progress: updated, library };
        });
      },

      getProgress: (novelSlug) => {
        return get().progress[novelSlug];
      },

      setShelf: (item) => {
        set((state) => ({
          library: {
            ...state.library,
            [item.slug]: {
              ...item,
              addedAt: new Date().toISOString(),
            },
          },
        }));
      },

      removeFromLibrary: (slug) => {
        set((state) => {
          const library = { ...state.library };
          delete library[slug];
          return { library };
        });
      },

      clearHistory: () => {
        set({ progress: {} });
      },

      getRecentProgress: () => {
        const list = Object.values(get().progress);
        return list.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },

      getLibraryByShelf: (shelf) => {
        return Object.values(get().library)
          .filter((item) => item.shelf === shelf)
          .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
      },
    }),
    {
      name: "bluenov-reading-progress-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
