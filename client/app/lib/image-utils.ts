const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

/**
 * Resolves a photo/image path into a full URL by prepending the backend API base URL
 * if the path is relative. Identifies if a path is already an absolute URL.
 * 
 * @param path The relative or absolute path of the image
 * @param isProfile Whether it's a profile photo (uses fallback logic if needed)
 * @returns {string | null} The resolved full URL or null
 */
export const resolvePhotoUrl = (path?: string | null, isProfile: boolean = false) => {
    if (!path || (isProfile && path === 'user.png')) {
        return null;
    }

    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }

    // Standardize path: remove redundant 'public/' prefix and leading slashes
    const cleanedPath = path
        .replace(/^public\//, "")
        .replace(/^\/+/, "");

    // If it's a simple filename and we're in profile mode, it's likely in userPhotos
    const finalPath = (isProfile && !cleanedPath.includes("/"))
        ? `userPhotos/${cleanedPath}`
        : cleanedPath;

    return `${API_BASE_URL}/${finalPath}`;
};
