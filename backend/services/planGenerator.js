const createPlanWithPromise = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      const { userDetails, touristPlaces, selectedHotel, exploreType } = payload;
      const numberOfDays = Number(userDetails.numberOfDays);
      const itinerary = [];

      for (let i = 0; i < numberOfDays; i++) {
        const dayPlan = {
          day: i + 1,
          places: touristPlaces.slice(i * 2, i * 2 + 2) // 2 places per day
        };

        // ExploreType check: hotels selected or not
        if (exploreType === 'hotels' && selectedHotel) {
          dayPlan.hotel = selectedHotel;
        }

        itinerary.push(dayPlan);
      }

      resolve(itinerary);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { createPlanWithPromise };
