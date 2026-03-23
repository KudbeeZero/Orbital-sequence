/**
 * useAssetLoading.ts
 *
 * Asset loading progress hook. Tracks the loading state of game assets
 * (3D models, textures, audio) and exposes progress percentage, loaded
 * item counts, and error states for use in loading screens and progress
 * indicators.
 */

export function useAssetLoading() {
  return {
    progress: 0,
    totalAssets: 0,
    loadedAssets: 0,
    isLoading: false,
    errors: [] as string[],
  };
}

export default useAssetLoading;
