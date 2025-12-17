# API Security Implementation Guide

## CRITICAL: Protecting Your Anthropic API Key

The current `index.html` file has the API key exposed in client-side JavaScript. This is **NOT SAFE** for production on a public website.

---

## Why This Matters

When you put the API key in JavaScript code:
- Anyone can view your browser source code
- Anyone can copy your API key
- They can use your API key and charge to your account
- You could rack up unexpected costs

---

## Secure Implementation (WordPress)

### Step 1: Create WordPress REST API Endpoint

Add this to your theme's `functions.php` or a custom plugin:

```php
<?php
/**
 * Secure API Proxy for Thank You Generator
 */

// Register REST API route
add_action('rest_api_init', function () {
    register_rest_route('thank-you/v1', '/generate', array(
        'methods' => 'POST',
        'callback' => 'proxy_claude_api',
        'permission_callback' => 'verify_thank_you_request'
    ));
});

// Verify the request is legitimate
function verify_thank_you_request($request) {
    // Option 1: Require nonce
    $nonce = $request->get_header('X-WP-Nonce');
    if (!wp_verify_nonce($nonce, 'wp_rest')) {
        return false;
    }

    // Option 2: Rate limiting (prevent abuse)
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_key = 'thank_you_rate_limit_' . md5($ip);
    $request_count = get_transient($transient_key);

    if ($request_count && $request_count > 20) {
        return new WP_Error(
            'rate_limit_exceeded',
            'Too many requests. Please try again later.',
            array('status' => 429)
        );
    }

    set_transient($transient_key, ($request_count ? $request_count + 1 : 1), HOUR_IN_SECONDS);

    return true;
}

// Proxy the request to Claude API
function proxy_claude_api($request) {
    // Get API key from WordPress options (stored securely)
    $api_key = get_option('anthropic_api_key');

    if (empty($api_key)) {
        return new WP_Error(
            'api_key_missing',
            'API key not configured',
            array('status' => 500)
        );
    }

    // Get request parameters
    $params = $request->get_json_params();

    // Validate required fields
    if (empty($params['prompt'])) {
        return new WP_Error(
            'invalid_request',
            'Missing required parameter: prompt',
            array('status' => 400)
        );
    }

    // Make request to Anthropic API
    $response = wp_remote_post('https://api.anthropic.com/v1/messages', array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'x-api-key' => $api_key,
            'anthropic-version' => '2023-06-01'
        ),
        'body' => json_encode(array(
            'model' => 'claude-3-5-sonnet-20241022',
            'max_tokens' => 500,
            'messages' => array(
                array(
                    'role' => 'user',
                    'content' => $params['prompt']
                )
            )
        )),
        'timeout' => 30
    ));

    // Handle errors
    if (is_wp_error($response)) {
        return new WP_Error(
            'api_request_failed',
            'Failed to connect to AI service',
            array('status' => 500)
        );
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);

    if ($status_code !== 200) {
        return new WP_Error(
            'api_error',
            'AI service returned an error',
            array('status' => $status_code)
        );
    }

    return json_decode($body);
}

// Admin page to save API key
add_action('admin_menu', function() {
    add_options_page(
        'Thank You Generator Settings',
        'Thank You Generator',
        'manage_options',
        'thank-you-generator',
        'thank_you_generator_settings_page'
    );
});

function thank_you_generator_settings_page() {
    if (isset($_POST['anthropic_api_key'])) {
        check_admin_referer('thank_you_generator_settings');
        update_option('anthropic_api_key', sanitize_text_field($_POST['anthropic_api_key']));
        echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
    }

    $api_key = get_option('anthropic_api_key');
    ?>
    <div class="wrap">
        <h1>Thank You Generator Settings</h1>
        <form method="post">
            <?php wp_nonce_field('thank_you_generator_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="anthropic_api_key">Anthropic API Key</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="anthropic_api_key"
                            name="anthropic_api_key"
                            value="<?php echo esc_attr($api_key); ?>"
                            class="regular-text"
                        />
                        <p class="description">
                            Get your API key from <a href="https://console.anthropic.com/" target="_blank">Anthropic Console</a>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
```

---

### Step 2: Update JavaScript to Use WordPress Endpoint

In your `index.html` or JavaScript file, find the `generateMessage` function (around line 1450) and replace the Anthropic API call:

**REPLACE THIS:**
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
    })
});
```

**WITH THIS:**
```javascript
const response = await fetch('/wp-json/thank-you/v1/generate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': wpApiSettings.nonce // WordPress provides this
    },
    body: JSON.stringify({
        prompt: prompt
    })
});
```

**And add nonce to your page:**
```php
// Add to your WordPress template or shortcode function
wp_localize_script('your-script-handle', 'wpApiSettings', array(
    'nonce' => wp_create_nonce('wp_rest')
));
```

---

### Step 3: Configure API Key in WordPress

1. Log in to WordPress admin
2. Go to **Settings → Thank You Generator**
3. Paste your Anthropic API key
4. Click "Save Changes"

---

## Alternative: Environment Variables

If your host supports environment variables (recommended for high-security needs):

**Add to `wp-config.php`:**
```php
define('ANTHROPIC_API_KEY', getenv('ANTHROPIC_API_KEY'));
```

**Then set environment variable on your server:**
```bash
# cPanel, Plesk, or hosting control panel
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

**Update functions.php:**
```php
function proxy_claude_api($request) {
    $api_key = ANTHROPIC_API_KEY; // Get from environment
    // ... rest of the code
}
```

---

## Rate Limiting Best Practices

Protect against abuse by implementing rate limiting:

```php
// In your verification function
function verify_thank_you_request($request) {
    $ip = $_SERVER['REMOTE_ADDR'];

    // Allow 20 requests per hour per IP
    $key = 'thank_you_limit_' . md5($ip);
    $count = get_transient($key) ?: 0;

    if ($count >= 20) {
        return new WP_Error(
            'rate_limit',
            'Too many requests. Please wait before trying again.',
            array('status' => 429)
        );
    }

    set_transient($key, $count + 1, HOUR_IN_SECONDS);

    return true;
}
```

---

## Cost Monitoring

1. **Set up billing alerts** in Anthropic Console
2. **Monitor usage** in Anthropic dashboard
3. **Set monthly budget limits**
4. **Log all API calls** for tracking:

```php
function proxy_claude_api($request) {
    // ... existing code ...

    // Log the request
    error_log(sprintf(
        '[Thank You Generator] API call from IP: %s, Prompt length: %d',
        $_SERVER['REMOTE_ADDR'],
        strlen($params['prompt'])
    ));

    // ... rest of code ...
}
```

---

## Security Checklist

- [ ] API key stored in WordPress options (not in code)
- [ ] REST API endpoint requires nonce verification
- [ ] Rate limiting implemented
- [ ] Input validation on all parameters
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS enabled on WordPress site
- [ ] Regular security updates on WordPress
- [ ] Monitor API usage in Anthropic Console
- [ ] Set up billing alerts

---

## For Development/Testing Only

If you need to test locally with the API key in the code temporarily:

1. Add to `index.html` (line ~1450):
```javascript
const ANTHROPIC_API_KEY = 'sk-ant-api03-YOUR-KEY-HERE';
```

2. **REMOVE THIS** before deploying to production
3. Use the WordPress proxy method for production

---

## Questions?

- Anthropic API Docs: https://docs.anthropic.com/
- WordPress REST API: https://developer.wordpress.org/rest-api/
- Security Best Practices: https://developer.wordpress.org/apis/security/
