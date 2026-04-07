# Component Prompt Templates
## Ready-to-use prompts for GitHub Copilot Chat

Copy-paste these prompts and attach screenshots for instant results.

---

## 🎨 UI COMPONENTS

### Button
```
Create a reusable Button component using React Bootstrap.

Props:
- variant: 'primary' | 'secondary' | 'outline' | 'danger'
- size: 'sm' | 'md' | 'lg'
- icon: React element (optional, shows before text)
- fullWidth: boolean (optional)
- loading: boolean (optional, shows spinner)
- disabled: boolean

Use CSS variables from src/styles/variables.css for colors.
Match the design in this screenshot exactly.
Add hover and active states.

[ATTACH SCREENSHOT]
```

---

### Input / Form Field
```
Create an Input component wrapping Bootstrap Form.Control.

Props:
- label: string (optional)
- type: 'text' | 'email' | 'password' | 'number' | 'tel'
- placeholder: string
- error: string (optional, shows validation error)
- icon: React element (optional, shows before input)
- helpText: string (optional, shows below input)

Include proper accessibility (labels, aria-attributes).
Match this design.

[ATTACH SCREENSHOT]
```

---

### Card
```
Create a Card component using React Bootstrap Card.

Props:
- image: string (optional)
- title: string
- description: string
- footer: React element (optional)
- variant: 'default' | 'elevated' | 'outlined'
- hoverable: boolean (optional, adds hover effect)

Match this design with proper spacing and shadows.

[ATTACH SCREENSHOT]
```

---

### Property Card (Rental Platform Specific)
```
Create a PropertyCard component for displaying rental properties.

Props (property object):
- id: string
- images: array of image URLs
- title: string
- location: string
- price: number
- bedrooms: number
- bathrooms: number
- area: number (square meters)
- rating: number (0-5)
- isFavorite: boolean

Features:
- Image carousel (if multiple images)
- Favorite button (heart icon) in top-right corner
- Price badge prominently displayed
- Amenities icons (bed, bath, area)
- "View Details" button
- On click navigates to /properties/:id

Use React Bootstrap Card as base.
Match this exact design.

[ATTACH SCREENSHOT]
```

---

### Modal / Dialog
```
Create a Modal component using React Bootstrap Modal.

Props:
- isOpen: boolean
- onClose: function
- title: string
- children: React element (modal content)
- footer: React element (optional, custom footer)
- size: 'sm' | 'md' | 'lg' | 'xl'
- centered: boolean (optional)

Include close button (X) and backdrop click to close.
Match this design.

[ATTACH SCREENSHOT]
```

---

### Navbar
```
Create a Navbar component using React Bootstrap Navbar.

Features:
- Logo/brand (left side)
- Navigation links: Home, Properties, About, Contact
- User menu (right side): Profile avatar dropdown with "My Profile", "My Bookings", "Logout"
- Notification bell icon with badge
- Responsive mobile menu (hamburger toggle)
- Search bar in center (optional)

For logged-out users, show: "Login" and "Sign Up" buttons
For logged-in users, show: User avatar + dropdown

Use React Router Link for navigation.
Match this design exactly.

[ATTACH SCREENSHOT]
```

---

## 📄 PAGES

### Login Page
```
Create a Login page component.

Layout:
- Centered card on page
- Logo at top
- "Welcome back" heading
- Email input
- Password input (with show/hide toggle)
- "Remember me" checkbox
- "Forgot password?" link
- Login button (full width)
- "Don't have an account? Sign up" link at bottom
- Optional: Social login buttons (Google, Facebook)

Use React Hook Form for form handling and validation.
On submit, call: await axios.post('/api/auth/login', { email, password })
Store token in localStorage and redirect to /dashboard

Match this design.

[ATTACH SCREENSHOT]
```

---

### Property Listing Page
```
Create a PropertyListingPage component.

Layout (Bootstrap Grid):
- Left sidebar (col-md-3): Filters
  - Search input (location)
  - Price range slider
  - Property type (checkboxes: Apartment, House, Studio)
  - Bedrooms (dropdown: Any, 1, 2, 3+)
  - Amenities (checkboxes: WiFi, Parking, Pool, etc.)
  - "Apply Filters" button
  
- Right content (col-md-9):
  - Page header with result count ("24 properties found")
  - Sort dropdown (Price: Low-High, High-Low, Newest)
  - Grid/List view toggle
  - PropertyCard grid (responsive: 3 cols desktop, 2 tablet, 1 mobile)
  - Pagination at bottom

API:
- Fetch from: GET /api/properties?location=&minPrice=&maxPrice=&type=
- Use useState for filters, useEffect to refetch on filter change
- Add loading skeleton while fetching

Match this layout.

[ATTACH SCREENSHOT]
```

---

### Property Details Page
```
Create a PropertyDetailsPage component.

Sections:
1. Image Gallery (top)
   - Large main image
   - Thumbnail grid below (4-6 images)
   - Click thumbnail to change main image
   - "View all photos" button (opens lightbox modal)

2. Property Info (col-md-8)
   - Title, location with map pin icon
   - Rating (stars) + review count
   - Price (large, prominent) per month
   - Description
   - Amenities grid with icons
   - House rules
   - Location map (embed Google Maps iframe)

3. Booking Sidebar (col-md-4, sticky)
   - Price summary card
   - Check-in / Check-out date pickers
   - Guest count selector
   - "Reserve" button
   - "Contact Landlord" button
   - Landlord info (avatar, name, "Member since")

API:
- Fetch from: GET /api/properties/:id
- Handle loading and error states

Match this design.

[ATTACH SCREENSHOT]
```

---

### User Dashboard
```
Create a UserDashboard page (for tenants).

Layout:
- Page header: "My Dashboard"
- Stats cards row (4 cards):
  - Active Bookings (count)
  - Saved Properties (count)
  - Unread Messages (count)
  - Total Spent (amount)

- Tabs navigation:
  - "My Bookings" (default active)
  - "Favorites"
  - "Messages"
  - "Profile Settings"

- Content area:
  - My Bookings tab: List of BookingCard components
    - Property image + details
    - Booking dates
    - Status badge (Pending, Confirmed, Completed, Cancelled)
    - "View Details" button
  
  - Favorites tab: Grid of PropertyCard components
  
  - Messages tab: Chat list (landlord name, last message, timestamp)
  
  - Profile Settings tab: Embedded ProfileSettings component

API:
- GET /api/user/bookings
- GET /api/user/favorites
- GET /api/user/messages

Match this layout.

[ATTACH SCREENSHOT]
```

---

### Landlord Dashboard
```
Create a LandlordDashboard page (for property owners).

Layout:
- Page header: "Landlord Dashboard" + "Add New Property" button
- Stats cards row:
  - Total Properties (count)
  - Active Listings (count)
  - Pending Bookings (count)
  - Monthly Revenue (amount)

- Tabs:
  - "My Properties" (default)
  - "Bookings"
  - "Analytics"

- My Properties tab:
  - Table view of properties:
    - Image thumbnail
    - Title, location
    - Price
    - Status (Active/Inactive toggle)
    - Actions: Edit, Delete, View Stats
  - Or: Grid of PropertyManagementCard components

- Add Property button opens modal with multi-step form:
  - Step 1: Basic Info (title, type, location)
  - Step 2: Details (beds, baths, area, price)
  - Step 3: Amenities (checkboxes)
  - Step 4: Photos (image upload with drag-drop)
  - Step 5: Review & Publish

API:
- GET /api/landlord/properties
- POST /api/properties (create)
- PUT /api/properties/:id (update)
- DELETE /api/properties/:id

Match this design.

[ATTACH SCREENSHOT]
```

---

## 🔌 API INTEGRATION

### Fetch List with Filters
```
Create a custom hook usePropertySearch for fetching and filtering properties.

Hook API:
const { properties, loading, error, refetch } = usePropertySearch(filters);

Features:
- Uses axios to GET /api/properties with query params
- Debounce search input (300ms)
- Loading state
- Error handling with toast notification
- Automatic refetch when filters change (useEffect)

Example usage:
const filters = { location, minPrice, maxPrice, type, bedrooms };
const { properties, loading } = usePropertySearch(filters);
```

---

### Form Submission with Validation
```
Create a form component for [FORM_NAME] using React Hook Form + Yup validation.

Fields:
- [List fields with types and validation rules]

Validation:
- [Field]: required, min length, format, etc.

On submit:
- POST to /api/[endpoint]
- Show loading spinner on button
- On success: Show success toast, redirect to [page]
- On error: Show error message below form

Use our Input and Button components.
Match this design.

[ATTACH SCREENSHOT]
```

---

## 🎯 HOW TO USE THESE PROMPTS

1. **Copy the relevant prompt**
2. **Modify placeholders** (e.g., [FORM_NAME], [endpoint])
3. **Attach screenshot from Figma**
4. **Paste in Copilot Chat** (VS Code)
5. **Get code in 10 seconds**
6. **Create component file**
7. **Test and refine**

---

## ⚡ PRO TIPS

**For faster results:**
- Keep prompts specific (mention exact prop names)
- Reference existing components ("Use our Button component")
- Specify Bootstrap components to use
- Mention responsive breakpoints if important
- Include API endpoints in prompt

**For better code quality:**
- Ask for TypeScript types (optional)
- Request error handling
- Ask for loading states
- Specify accessibility requirements
- Mention edge cases

---

## 🚀 EXAMPLE SESSION (Property Card)

**You:**
```
Create a PropertyCard component for displaying rental properties.

[...paste prompt from above...]

[ATTACH SCREENSHOT]
```

**Copilot Response (10 seconds later):**
```jsx
import { Card, Badge } from 'react-bootstrap';
import { FaBed, FaBath, FaRuler, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const { id, images, title, location, price, bedrooms, bathrooms, area, rating, isFavorite } = property;

  return (
    <Card className="property-card h-100">
      <div className="property-image-container">
        <Card.Img variant="top" src={images[0]} alt={title} />
        <button className="favorite-btn">
          <FaHeart className={isFavorite ? 'active' : ''} />
        </button>
        <Badge bg="primary" className="price-badge">
          ${price}/month
        </Badge>
      </div>
      
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="location text-muted">
          📍 {location}
        </Card.Text>
        
        <div className="amenities d-flex gap-3 mb-3">
          <span><FaBed /> {bedrooms} beds</span>
          <span><FaBath /> {bathrooms} baths</span>
          <span><FaRuler /> {area} m²</span>
        </div>
        
        <Link to={`/properties/${id}`} className="btn btn-primary w-100">
          View Details
        </Link>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
```

**You test it, works 90%, tweak CSS, DONE in 5 minutes.** ✅
