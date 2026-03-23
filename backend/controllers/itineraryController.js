// ===================== TIME UTILS =====================

// Convert HH:MM to minutes
const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Convert minutes to HH:MM
const minutesToTime = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

// ===================== NORMAL ITINERARY =====================

export const generateItinerary = (touristPlaces, startTime, numberOfDays) => {
  const itinerary = [];

  const DAY_START = timeToMinutes("09:00");
  const DAY_END = timeToMinutes("18:00");
  const BUFFER = 45;

  const sorted = [...touristPlaces].sort((a, b) => b.popularity - a.popularity);
  const visited = new Set();

  for (let day = 1; day <= numberOfDays; day++) {
    let timePointer = DAY_START;
    let todayPlaces = [];
    let visitedPlacesCount = 0;

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      if (visited.has(p.id)) continue;

      const duration = (p.averageVisitDuration || 1) * 60;
      const finishTime = timePointer + duration;

      if (finishTime > DAY_END) continue;

      todayPlaces.push({
        name: p.name,
        startTime: minutesToTime(timePointer),
        endTime: minutesToTime(finishTime),
        duration: duration / 60,
        description: p.description,
        category: p.category,
      });

      visited.add(p.id);
      timePointer = finishTime + BUFFER;
      visitedPlacesCount++;
    }

    // ⭐ Places finished completely
    if (todayPlaces.length === 0 && visited.size === sorted.length) {
      itinerary.push({
        day,
        places: [],
        noPlaces: true,
        message: "No tourist places to visit today",
      });
      continue;
    }

    // ⚠ Day empty but places still exist
    if (todayPlaces.length === 0) {
      itinerary.push({
        day,
        places: [],
        noPlaces: true,
        message: "",
      });
      continue;
    }

    itinerary.push({ day, places: todayPlaces });
  }

  return {
    itinerary,
    includedPlacesCount: visited.size
  };
};

// ===================== HOTEL BASED ITINERARY =====================

export const generateHotelItinerary = (
  hotel,
  touristPlaces,
  checkInTime,
  numberOfDays
) => {
  const itinerary = [];

  const DAILY_START = "09:00";
  const DAILY_END = "18:00";
  const BUFFER = 30;

  const sortedPlaces = [...touristPlaces].sort(
    (a, b) => b.popularity - a.popularity
  );

  // ⭐ No places at all
  if (sortedPlaces.length === 0) {
    return {
      itinerary: Array.from({ length: numberOfDays }, (_, i) => ({
        day: i + 1,
        places: [],
        noPlaces: true,
        message: "No Tourist Places For This Location",
      })),
      includedPlacesCount: 0
    };
  }

  let placeIndex = 0;
  let visitedPlacesCount = 0;

  for (let day = 1; day <= numberOfDays; day++) {

    // ⭐ IMPORTANT FIX → Places finished early
    if (placeIndex >= sortedPlaces.length) {
      itinerary.push({
        day,
        places: [],
        noPlaces: true,
        message: "No tourist places to visit today",
      });
      continue;
    }

    const placesForDay = [];
    let currentTime = day === 1 ? checkInTime : DAILY_START;
    let currentMinutes = timeToMinutes(currentTime);

    if (currentMinutes < timeToMinutes(DAILY_START)) {
      currentMinutes = timeToMinutes(DAILY_START);
    }

    // 🏨 Starting from hotel
    placesForDay.push({
      name: `${hotel.name} (Starting Point${day === 1 ? " - Check-in" : ""})`,
      startTime: minutesToTime(currentMinutes),
      endTime: minutesToTime(currentMinutes),
      duration: 0,
      description:
        day === 1
          ? `Check-in at ${hotel.address}`
          : `Depart from ${hotel.address}`,
      category: "hotel",
      isStartingPoint: true,
    });

    // 🚶 Visit places
    while (placeIndex < sortedPlaces.length) {
      const place = sortedPlaces[placeIndex];
      const visitDuration = place.averageVisitDuration || 1;
      const visitMinutes = visitDuration * 60;

      const endMinutes = currentMinutes + visitMinutes;
      if (endMinutes > timeToMinutes(DAILY_END)) break;

      placesForDay.push({
        name: place.name,
        startTime: minutesToTime(currentMinutes),
        endTime: minutesToTime(endMinutes),
        duration: visitDuration,
        description: place.description || "No description available",
        category: place.category || "general",
      });

      currentMinutes = endMinutes + BUFFER;
      placeIndex++;
      visitedPlacesCount++;
    }

    // 🏠 Return to hotel
    placesForDay.push({
      name: `Return to ${hotel.name}`,
      startTime: minutesToTime(currentMinutes),
      endTime: minutesToTime(currentMinutes),
      duration: 0,
      description: "Return to hotel",
      category: "hotel",
      isEndPoint: true,
    });

    itinerary.push({
      day,
      places: placesForDay,
    });
  }

  return {
    itinerary,
    includedPlacesCount: visitedPlacesCount
  };
};
