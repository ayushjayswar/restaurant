import { useEffect, useState } from 'react';

// Backend URL. Tunnel ka URL badle to .env me VITE_API_URL set karo.
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://lcd-dressing-jim-oven.trycloudflare.com';

const DEFAULT_FACILITIES = ['AC', 'WiFi', 'Separate Lat-Bath'];
const DEFAULT_CAPACITY = '2 Adults + 1 Child';
const DEFAULT_DESCRIPTION =
  'A comfortable AC room with WiFi and a separate lat-bath.';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0';

// Backend ke room ko page ke format me badalta hai
//   price            -> Night
//   price_day        -> Day
//   price_day_night  -> Day & Night
export const normalizeRoom = (room) => ({
  id: room.id,
  name: room.name || 'Room',
  capacity: room.capacity || DEFAULT_CAPACITY,
  nightPrice: Number(room.price || 0),
  dayPrice: Number(room.price_day || room.price || 0),
  dayNightPrice: Number(room.price_day_night || 0),
  facilities:
    Array.isArray(room.facilities) && room.facilities.length > 0
      ? room.facilities
      : DEFAULT_FACILITIES,
  description: room.description || DEFAULT_DESCRIPTION,
  image: room.image || DEFAULT_IMAGE,
});

// Rooms page aur RoomBooking page dono yahi use karte hain,
// isliye rooms laane ka code sirf yahan hai.
export default function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/rooms`);
        if (!response.ok) throw new Error('Rooms fetch failed');

        const result = await response.json();
        if (!cancelled) {
          setRooms((result.rooms || []).map(normalizeRoom));
        }
      } catch (err) {
        console.error('Rooms API Error:', err);
        if (!cancelled) setError('Rooms load nahi ho paye. Thodi der baad dobara try karo.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, []);

  return { rooms, loading, error };
}