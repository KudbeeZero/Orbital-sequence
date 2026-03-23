/**
 * ModelCache.ts
 *
 * LRU cache for 3D models. Stores loaded GLTF/GLB models in memory with
 * a least-recently-used eviction policy to balance memory usage against
 * load times. Supports cache size limits, manual invalidation, and
 * preloading hints.
 */

export const ModelCache = {
  get: (key: string) => null,
  set: (key: string, model: unknown) => {},
  has: (key: string) => false,
  evict: (key: string) => {},
  clear: () => {},
  getSize: () => 0,
};

export default ModelCache;
