# Thank You Note Generator - Features & User Flow

## Overview
A web application that generates personalized thank-you notes using AI, with printable PDFs for cards, address labels, and envelope seals.

---

## Complete User Flow (6 Steps)

### Step 1: Welcome Page
**What User Sees:**
- Hero section with title "Thank You Note Generator"
- Subtitle about AI-powered personalization
- Three feature cards:
  - "AI-Powered Messages" 💌
  - "Beautiful Designs" 🏷️
  - "Print Ready PDFs" 💫
- "How It Works" section with solid teal background
- "Always Free to Use" badge
- "Get Started" button (orange)

**User Action:**
- Clicks "Get Started" to begin

---

### Step 2: Your Details
**What User Enters:**
- First Name (required)
- Last Name (required)
- Event Type: dropdown (Wedding, Baby Shower, Birthday, Graduation, Holiday, Other)
- Initials (optional, 1-4 characters) - for envelope seals
  - Helper text: "Most people use initials for their envelope seals 💡"
- Return Address (with Google Places autocomplete if API enabled):
  - Street Address
  - Apartment/Suite (optional)
  - City
  - State (dropdown with all US states)
  - ZIP Code

**User Action:**
- Fills out form
- Clicks "Continue to Add Guests" (orange button)

---

### Step 3: Add Guests
**Two Input Methods:**

#### Method A: Manual Entry
**What User Enters for Each Guest:**
- First Name (required)
- Last Name (required)
- Special Moment (optional) - e.g., "heartfelt toast" or "traveling so far"
- Relationship (optional) - e.g., friend, cousin, aunt, colleague
- Mailing Address (with autocomplete):
  - Street Address
  - Apartment/Suite (optional)
  - City
  - State
  - ZIP Code
- Helper text: "💡 Hit submit for each guest"
- "Submit" button (orange) - adds guest to list

#### Method B: CSV Upload
**CSV Format Required:**
```
firstName,lastName,memo,relationship,addr,addr2,city,state,zip
John,Smith,heartfelt toast,friend,123 Main St,,Boston,MA,02101
Jane,Doe,traveling so far,cousin,456 Oak Ave,Apt 2,Chicago,IL,60601
```

**Features:**
- Drag & drop or click to upload
- Accepts .csv files
- Shows upload icon 📤
- "Switch Input Method" button to toggle between manual/CSV

**Guest List Display:**
- Shows all added guests
- Each guest card shows: Name, Address, Special Moment, Relationship
- Edit button (✏️) - allows editing guest details
- Delete button (🗑️) - removes guest from list

**User Action:**
- Adds guests via manual entry or CSV
- Reviews guest list
- Clicks "Continue to Design →" (orange button)

---

### Step 4: Customize Design
**What User Can Customize:**

#### Card Colors (6 options)
- Sage Green (#9BAF9E)
- Dusty Blue (#A4B8C4)
- Blush Pink (#E8B4B8)
- Warm Taupe (#C9ADA7)
- Soft Lavender (#B8A9C9)
- Cream (#F5E6D3)

#### Font Styles (5 options)
- Classic Serif
- Modern Sans
- Elegant Script
- Handwritten
- Friendly Casual

#### Design Patterns (5 options)
- Minimal (clean, simple)
- Floral (delicate flowers)
- Geometric (modern shapes)
- Waves (flowing lines)
- Ornate Dots (decorative)

#### Seal Designs (5 options)
Preview shows how initials will appear:
- Minimal Circle
- Floral Border
- Geometric Frame
- Wave Pattern
- Ornate Dots

**Live Preview:**
- Shows sample card with selected color, font, pattern
- Updates in real-time as user makes selections
- Displays sample text and signature

**User Action:**
- Selects preferred color, font, pattern, and seal
- Reviews preview
- Clicks "Continue to Review →" (orange button)

---

### Step 5: Review & Generate Messages
**What Happens:**
- Shows "Generating Personalized Messages..." progress indicator
- AI (Claude) generates unique message for each guest using:
  - Event type
  - Guest's name
  - Special moment (if provided)
  - Relationship (if provided)
  - Your name

**Message Preview:**
- Shows all generated cards in a grid
- Each card displays:
  - Guest name
  - Full personalized message
  - Your signature
  - Selected color, font, and pattern

**User Action:**
- Reviews all generated messages
- Clicks "Continue to Download →" (orange button)

---

### Step 6: Download
**Page Header:**
- "Ready! 🎉"
- "[X] personalized cards"
- "Edit colors or design" button (teal) - goes back to step 4

**Four Download Options:**

#### 1. Cards 💌
- Format: PDF with 4 postcards per page
- Paper: Avery 5389 postcard stock
- Size: 5.5" x 4.25" each
- Content: Personalized message + design + signature
- "📥 Download" button (orange)

#### 2. Recipient Labels 🏷️
- Format: PDF with 30 labels per page
- Paper: Avery 5160 address labels
- Content: Guest mailing addresses
- "📥 Download" button (orange)

#### 3. Return Labels 📮
- Format: PDF with 30 labels per page
- Paper: Avery 5160 address labels
- Content: Your return address
- "📥 Download" button (orange)

#### 4. Seals 💫
- Format: PDF with round stickers
- Paper: Avery 8293 (1.5" round stickers)
- Content: Your initials in selected seal design
- "📥 Download" button (orange)

**How to Use Your Downloads Section:**
- Green/teal background card
- Instructions: "Click each product below to shop on Amazon"
- Five product links (underlined for clarity):

1. **Cards** 💌
   - Links to Avery 5389 on Amazon
   - Description: Print 4 postcards per sheet, no folding required

2. **A2 Envelopes** ✉️
   - Links to A2 envelopes on Amazon
   - Description: Perfect fit for 5.5" x 4.25" postcards

3. **Recipient Labels** 🏷️
   - Links to Avery 5160 on Amazon
   - Description: Peel and stick to envelope front

4. **Return Labels** 📮
   - Links to Avery 5160 on Amazon
   - Description: Goes on envelope back flap (top left)
   - Tip: "💡 Use same Avery 5160 sheets for both recipient and return labels!"

5. **Seals** 💫
   - Links to Avery 8293 on Amazon
   - Description: Peel and stick to sealed envelope flap

**Pro Tip Section:**
- Light background callout box
- "💡 Pro Tip"
- Text: "If you don't have a printer at home, save the PDFs to a USB drive and take them to your local print shop (Staples, FedEx Office, or UPS Store). They can print everything for you!"

**Find Nearby Print Shops:**
- Search button that opens Google Maps
- Automatically searches for "print shop near [your return address]"

---

## Key Features

### AI-Powered Personalization
- Uses Claude 3.5 Sonnet model
- Generates unique messages for each guest
- Incorporates:
  - Event context
  - Special moments
  - Relationship details
  - Personal touch

### Smart PDF Generation
- Professional print-ready formatting
- Aligns to standard Avery label templates
- High-quality output
- Batch generation for multiple guests

### Address Autocomplete
- Google Places API integration (optional)
- Makes address entry faster
- Reduces errors
- Works for both sender and guest addresses

### CSV Import
- Bulk upload capability
- Standard CSV format
- Handles large guest lists
- Validates data on import

### Real-time Preview
- Instant design updates
- See before you generate
- No surprises
- Professional results

### Mobile Responsive
- Works on all devices
- Touch-friendly interface
- Responsive layout
- Optimized for phones and tablets

---

## Design System

### Colors
- **Primary Teal:** #008182 (buttons, headings, links)
- **Primary Orange:** #FF6B35 (CTA buttons)
- **Accent Teal:** #31D7CA (borders, accents)
- **Light Background:** #E1E7EF
- **Card Background:** #F4F7FC
- **White:** #FFFFFF
- **Text Dark:** #272D3F
- **Text Gray:** #666666

### Typography
- **Body Font:** Poppins (sans-serif)
- **Headings:** Poppins (weight: 600)
- **Card Fonts:**
  - Classic: Georgia
  - Modern: Poppins
  - Script: Dancing Script
  - Handwritten: Caveat
  - Casual: Kalam

### Buttons
- **Primary (Orange):**
  - Background: #FF6B35
  - Text: White
  - Use: Main CTAs

- **Secondary (Teal):**
  - Background: #008182
  - Text: White
  - Use: Back/alternative actions

### Spacing
- Card padding: 2-3rem
- Section margins: 2-3rem
- Button padding: 0.75-1rem vertical, 1.5-2.5rem horizontal
- Grid gaps: 1-2rem

---

## Technical Features

### External Libraries
- **React 18** - UI framework
- **Babel Standalone** - JSX transpilation
- **jsPDF** - PDF generation
- **html2canvas** - HTML to image conversion
- **PapaParse** - CSV parsing
- **Google Places API** - Address autocomplete

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### Performance
- Client-side rendering
- No server required (except for API proxy)
- Fast PDF generation
- Efficient state management

---

## Sample Output

### Example Card Message
```
Dear Sarah,

Thank you so much for celebrating our wedding with us! Your heartfelt
toast meant the world to us and we'll cherish that memory forever.

We're so grateful to have such a wonderful friend in our lives. Your
presence made our special day even more magical.

With love and appreciation,
Emily & James
```

### Example Seal
```
┌─────────────┐
│             │
│     E&J     │  (in selected font/pattern)
│             │
└─────────────┘
```

---

## Use Cases

1. **Weddings** - Thank guests for attending, gifts, traveling
2. **Baby Showers** - Thank for gifts, support, celebration
3. **Birthdays** - Thank for gifts, attendance, well-wishes
4. **Graduations** - Thank for support, gifts, encouragement
5. **Holidays** - Thank for gifts, cards, hospitality
6. **General** - Any thank-you occasion

---

## Competitive Advantages

1. **AI Personalization** - Unique messages, not templates
2. **All-in-One Solution** - Cards, labels, seals in one place
3. **Free to Use** - No subscription or per-card fees
4. **Professional Quality** - Print-ready PDFs
5. **Easy to Use** - Simple 6-step process
6. **Bulk Capable** - Handle hundreds of guests
7. **Mobile Friendly** - Works on any device

---

## Future Enhancement Ideas

- Save/resume progress
- Email PDF delivery
- Custom card sizes
- Photo uploads
- More design options
- Message editing
- Preview before generate
- Export guest list
- Duplicate guest detection
- International addresses
