export type Collection = {
    id: string;
    name: string;
    playlistIds: string[];
    createdAt: number;
    updatedAt: number;
};

export type PlaylistMeta = {
    id: string;
    name: string;
    collectionId?: string | null;
    isFavorite?: boolean;
    createdAt: number;
    updatedAt: number;
};

const COLLECTIONS_KEY = 'focustube_collections';
const PLAYLIST_META_KEY = 'focustube_playlist_meta';

const safeParse = <T>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
};

export const loadCollections = (): Collection[] => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    return safeParse<Collection[]>(raw, []);
};

export const saveCollections = (collections: Collection[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
};

export const loadPlaylistMeta = (): Record<string, PlaylistMeta> => {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(PLAYLIST_META_KEY);
    return safeParse<Record<string, PlaylistMeta>>(raw, {});
};

export const savePlaylistMeta = (meta: Record<string, PlaylistMeta>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PLAYLIST_META_KEY, JSON.stringify(meta));
};

export const upsertPlaylistMeta = (
    meta: PlaylistMeta,
    existing?: Record<string, PlaylistMeta>
) => {
    const next = { ...(existing ?? loadPlaylistMeta()) };
    next[meta.id] = meta;
    savePlaylistMeta(next);
    return next;
};
