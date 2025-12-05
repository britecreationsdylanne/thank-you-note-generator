// Netlify Function to securely call Google Places API
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { input } = JSON.parse(event.body);

    if (!input) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Input is required' })
      };
    }

    // Call Google Places Autocomplete API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&components=country:us&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      {
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to get address suggestions' })
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
