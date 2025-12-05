// Netlify Function to securely call Google Places Details API
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { placeId } = JSON.parse(event.body);

    if (!placeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Place ID is required' })
      };
    }

    // Call Google Places Details API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=address_components&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      {
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places Details API error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to get place details' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
