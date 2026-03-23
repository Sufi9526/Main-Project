const prompt = `
Return ONLY valid JSON. No explanation.

Create a ${numberOfDays}-day travel itinerary for ${destination}.
Start time: ${startTime}
Hotel: ${hotelName || 'null'}

Places:
${places.join('\n')}

Format strictly like this:
{
  "days": [
    {
      "day": 1,
      "places": [{ "name": "Place name" }],
      "hotel": null
    }
  ]
}
`;
