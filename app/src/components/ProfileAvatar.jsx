import { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../utils/cn';
import { Avatar } from './ui/primitives';

const STORAGE_KEY = 'pucho.profilePhoto';
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const EVENT = 'pucho:profile-photo-changed';

export function getStoredPhoto() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Profile picture with click-to-change.
 * Clicking the avatar opens the file picker; the chosen image is stored locally
 * (base64 in localStorage) and every mounted avatar updates instantly.
 */
export default function ProfileAvatar({ name = 'Admin', size = 28, className = '', editable = true }) {
  const inputRef = useRef(null);
  const [photo, setPhoto] = useState(() => getStoredPhoto());

  // Keep every avatar on the page in sync (this tab + other tabs)
  useEffect(() => {
    const sync = () => setPhoto(getStoredPhoto());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const broadcast = useCallback(() => window.dispatchEvent(new Event(EVENT)), []);

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Image must be under 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem(STORAGE_KEY, reader.result);
        setPhoto(reader.result);
        broadcast();
        toast.success('Profile photo updated');
      } catch {
        toast.error('Could not save photo — storage is full');
      }
    };
    reader.onerror = () => toast.error('Could not read that image');
    reader.readAsDataURL(file);
  }

  function removePhoto(e) {
    e.stopPropagation();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setPhoto(null);
    broadcast();
    toast.success('Profile photo removed');
  }

  // No remote avatar service: an uploaded photo, otherwise initials (offline, consistent, no third-party call).
  const src = photo;
  const iconSize = Math.max(12, Math.round(size * 0.34));
  const face = src ? <img src={src} alt={name} className="w-full h-full object-cover bg-white" /> : <Avatar name={name} size={size} className="w-full h-full" />;

  if (!editable) {
    return src
      ? <img src={src} alt={name} style={{ width: size, height: size }} className={cn('rounded-full object-cover flex-shrink-0 bg-white', className)} />
      : <Avatar name={name} size={size} className={className} />;
  }

  return (
    <div className="relative group/avatar flex-shrink-0" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
        title="Change profile photo"
        aria-label="Change profile photo"
        className={cn(
          'no-pill relative block rounded-full overflow-hidden ring-0 hover:ring-2 hover:ring-primary-300',
          'transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
          className
        )}
        style={{ width: size, height: size }}
      >
        {face}
        <span className="absolute inset-0 flex items-center justify-center bg-primary-900/55 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
          <Camera style={{ width: iconSize, height: iconSize }} className="text-white" />
        </span>
      </button>

      {photo && size >= 56 && (
        <button
          type="button"
          onClick={removePhoto}
          title="Remove photo"
          aria-label="Remove profile photo"
          className="no-pill absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
