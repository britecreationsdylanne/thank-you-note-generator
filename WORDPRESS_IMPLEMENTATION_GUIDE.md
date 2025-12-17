# Thank You Note Generator - WordPress Implementation Guide

## Overview
This is a single-page React application that generates personalized thank-you notes with AI, allowing users to download printable PDFs for cards, labels, and envelope seals.

---

## Implementation Options

### Option 1: Full Page Template (Recommended)
Create a dedicated page for the generator without WordPress theme elements.

**Steps:**
1. Create a new WordPress page template file: `page-thank-you-generator.php`
2. Copy the entire `index.html` file contents into this template
3. Create a new page in WordPress and assign it the "Thank You Generator" template

**Template Code:**
```php
<?php
/*
Template Name: Thank You Generator
*/
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You Note Generator</title>
    <!-- Copy all scripts and styles from index.html here -->
</head>
<body>
    <!-- Copy entire body content from index.html here -->
</body>
</html>
```

---

### Option 2: Shortcode Integration
Embed the generator within your existing WordPress theme.

**Steps:**
1. Create a custom plugin or add to `functions.php`
2. Enqueue scripts and styles
3. Use shortcode `[thank_you_generator]` in any page

**Code Example:**
```php
// Add to functions.php or custom plugin

function thank_you_generator_scripts() {
    // Only load on pages with the shortcode
    if (has_shortcode(get_post()->post_content, 'thank_you_generator')) {
        // React dependencies
        wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18', false);
        wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18', false);
        wp_enqueue_script('babel-standalone', 'https://unpkg.com/@babel/standalone/babel.min.js', array(), null, false);

        // PDF generation
        wp_enqueue_script('papaparse', 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js', array(), '5.4.1', false);
        wp_enqueue_script('jspdf', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', array(), '2.5.1', false);
        wp_enqueue_script('html2canvas', 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', array(), '1.4.1', false);

        // Google Fonts
        wp_enqueue_style('thank-you-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Dancing+Script:wght@400;700&family=Caveat:wght@400;700&family=Great+Vibes&family=Satisfy&family=Kalam:wght@400;700&display=swap');
    }
}
add_action('wp_enqueue_scripts', 'thank_you_generator_scripts');

function thank_you_generator_shortcode() {
    ob_start();
    ?>
    <div id="thank-you-app"></div>
    <style>
        /* Copy all CSS from index.html <style> tag here */
    </style>
    <script type="text/babel">
        /* Copy all JavaScript from index.html <script type="text/babel"> tag here */
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('thank_you_generator', 'thank_you_generator_shortcode');
```

---

## Required API Configuration

### Anthropic API Key
The application uses Claude AI to generate personalized messages.

**Setup:**
1. Get API key from: https://console.anthropic.com/
2. Add to WordPress (choose one method):

**Method A - Environment Variable (Most Secure):**
Add to `wp-config.php`:
```php
define('ANTHROPIC_API_KEY', 'sk-ant-api03-your-key-here');
```

**Method B - Custom Field:**
Create a settings page or use a custom field to store the key securely.

**Method C - Hardcode (Not Recommended for Production):**
Replace in the JavaScript code:
```javascript
const ANTHROPIC_API_KEY = 'sk-ant-api03-your-key-here';
```

**IMPORTANT SECURITY NOTE:**
- Never expose the API key in client-side code for production
- Consider creating a WordPress REST API endpoint that handles Claude API calls server-side
- This protects your API key from being visible in browser source code

---

## Server-Side API Proxy (Recommended for Production)

To secure your API key, create a WordPress REST API endpoint:

**Add to functions.php or plugin:**
```php
// Register REST API endpoint
add_action('rest_api_init', function () {
    register_rest_route('thank-you/v1', '/generate-message', array(
        'methods' => 'POST',
        'callback' => 'generate_thank_you_message',
        'permission_callback' => '__return_true' // Add proper authentication in production
    ));
});

function generate_thank_you_message($request) {
    $params = $request->get_json_params();

    $api_key = get_option('anthropic_api_key'); // Store in WordPress options

    $response = wp_remote_post('https://api.anthropic.com/v1/messages', array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'x-api-key' => $api_key,
            'anthropic-version' => '2023-06-01'
        ),
        'body' => json_encode($params),
        'timeout' => 30
    ));

    if (is_wp_error($response)) {
        return new WP_Error('api_error', 'Failed to generate message', array('status' => 500));
    }

    $body = wp_remote_retrieve_body($response);
    return json_decode($body);
}
```

**Update JavaScript to use WordPress endpoint:**
```javascript
// Replace the Anthropic API call with:
const response = await fetch('/wp-json/thank-you/v1/generate-message', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
    })
});
```

---

## Google Places API (Optional)

The app uses Google Places API for address autocomplete.

**Setup:**
1. Get API key from: https://console.cloud.google.com/
2. Enable "Places API" and "Maps JavaScript API"
3. Add the script in the WordPress header or in the template:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places"></script>
```

**Note:** The app works without this - users just won't get address autocomplete.

---

## File Structure

```
wordpress-theme/
├── page-thank-you-generator.php   (Full page template)
└── functions.php                  (Shortcode implementation)
```

OR

```
wordpress-plugins/
└── thank-you-generator/
    ├── thank-you-generator.php    (Main plugin file)
    ├── assets/
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── app.js
    └── includes/
        └── api-proxy.php
```

---

## Testing Checklist

- [ ] All dependencies load (React, jsPDF, html2canvas, PapaParse)
- [ ] API key configured and working
- [ ] Address autocomplete working (if Google API enabled)
- [ ] Step navigation working (6 steps total)
- [ ] Guest list creation working
- [ ] CSV upload working
- [ ] Message generation working
- [ ] Design customization working
- [ ] PDF downloads working (cards, labels, seals)
- [ ] All buttons styled correctly
- [ ] Mobile responsive
- [ ] No console errors

---

## Color Scheme

- **Primary Teal:** `#008182`
- **Primary Orange:** `#FF6B35`
- **Accent Teal:** `#31D7CA`
- **Light Background:** `#E1E7EF`
- **Card Background:** `#F4F7FC`
- **Text Dark:** `#272D3F`
- **Text Gray:** `#666`

---

## Support Files

Included in this package:
- `index.html` - Complete standalone application
- `WORDPRESS_IMPLEMENTATION_GUIDE.md` - This guide
- `API_SECURITY_GUIDE.md` - Detailed security implementation

---

## Quick Start for Development Team

1. **Test the standalone version first:**
   - Open `index.html` in a browser
   - Add API key directly in the code (line ~1450)
   - Verify all features work

2. **Choose implementation method:**
   - Full page template = cleanest, easiest
   - Shortcode = more flexible, integrates with theme

3. **Set up API security:**
   - Create WordPress REST endpoint for Claude API
   - Store API key in WordPress options (not in code)

4. **Deploy and test:**
   - Test all 6 steps of the flow
   - Test PDF generation
   - Test on mobile devices

---

## Common Issues & Solutions

**Issue:** React not loading
- **Solution:** Check script load order - React must load before React-DOM

**Issue:** PDFs not generating
- **Solution:** Ensure jsPDF and html2canvas load before app code

**Issue:** API errors
- **Solution:** Check API key validity and rate limits

**Issue:** Styles conflict with theme
- **Solution:** Wrap all CSS in a unique class: `.thank-you-generator { ... }`

---

## Questions?

Contact: [Your Contact Info]
Repository: https://github.com/britecreationsdylanne/thank-you-note-generator
