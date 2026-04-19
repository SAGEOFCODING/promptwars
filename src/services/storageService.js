import { storage, logAnalyticsEvent, logUserAction } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';

/**
 * Upload an incident report image to Google Cloud Storage.
 * @param {string} uid - User ID
 * @param {File|Blob} file - The image file
 * @param {string} zoneId - Associated zone ID
 */
export const uploadIncidentImage = async (uid, file, zoneId) => {
  if (!storage) {
    console.warn('[storageService] Storage not configured, skipping upload.');
    return null;
  }

  const timestamp = Date.now();
  const filePath = `incidents/${uid}/${zoneId}_${timestamp}.jpg`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: 'image/jpeg',
      customMetadata: {
        uid,
        zoneId,
        timestamp: timestamp.toString(),
      },
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    await Promise.allSettled([
      logAnalyticsEvent('incident_image_uploaded', { zoneId, uid }),
      logUserAction(uid, 'upload_incident_image', { zoneId, url: downloadURL }),
    ]);

    return downloadURL;
  } catch (error) {
    console.error('[storageService] Upload failed:', error);
    await logAnalyticsEvent('incident_image_upload_failed', { zoneId, error: error.message });
    throw error;
  }
};

/**
 * Get all files for a specific user.
 * Demonstrates listAll capability.
 */
export const getUserUploads = async (uid) => {
  if (!storage) return [];
  const listRef = ref(storage, `uploads/${uid}`);
  try {
    const res = await listAll(listRef);
    const urlPromises = res.items.map((item) => getDownloadURL(item));
    return await Promise.all(urlPromises);
  } catch {
    return [];
  }
};

/**
 * Delete a file from storage.
 */
export const deleteUpload = async (filePath) => {
  if (!storage) return;
  const fileRef = ref(storage, filePath);
  try {
    await deleteObject(fileRef);
    await logAnalyticsEvent('file_deleted', { path: filePath });
  } catch {
    // Non-critical
  }
};
