# Ren&Go Frontend - 30-Day Development Plan

## 🎯 GOAL: Complete frontend + testing in 30 days for house rental platform

---

## 📋 PHASE 1: Design System Setup (Days 1-2)

### Day 1: Extract Design Tokens from Figma

**What to do:**
1. Open Figma → Select any component
2. Extract these values:
   - **Colors**: Primary, secondary, success, danger, backgrounds, text colors
   - **Typography**: Font families, sizes (h1-h6, body, small)
   - **Spacing**: Margins/paddings (4px, 8px, 16px, 24px, 32px, etc.)
   - **Border radius**: Buttons, cards, inputs
   - **Shadows**: Card shadows, hover effects

3. Update `src/styles/variables.css` with exact Figma values
4. Create `src/styles/bootstrap-overrides.css` to customize Bootstrap

**Tools:**
- Figma Inspect panel (right sidebar) - shows exact CSS values
- Copy values manually (5-10 minutes only)

**Output:** 
- ✅ Design tokens file ready
- ✅ Bootstrap customized to match Figma

---

### Day 2: Build Component Library (Atomic Components)

**Priority Order:**
1. **Button** (primary, secondary, outline, sizes)
2. **Input/Form Controls** (text, email, password, textarea, select)
3. **Card** (property card, info card)
4. **Badge/Tag** (status indicators)
5. **Modal** (confirmation, forms)

**Workflow:**
1. Take screenshot of ONE component from Figma (e.g., Button in all states)
2. Send to Copilot Chat: "Create a React Bootstrap Button component matching this design. Make it accept variant, size, icon props. Use our CSS variables."
3. Save to `src/components/common/Button.jsx`
4. Test immediately in a demo page
5. Refine spacing/colors if needed

**Time:** ~2-3 hours for all 5 base components

---

## 📋 PHASE 2: Layout Components (Days 3-4)

### Day 3: Core Layout

**Components to build:**
1. **Navbar** - Screenshot → Copilot → Build
   - Logo, navigation links, user menu/avatar, notifications
   - Responsive mobile menu
   
2. **Footer** - Quick build (30 min)
   - Links, social media, copyright

3. **Sidebar** (if dashboard has one)
   - Navigation menu for dashboard

**Workflow:**
- Screenshot entire navbar from Figma
- Send to Copilot: "Build this navbar using React Bootstrap Navbar component. Make it responsive with mobile menu toggle."
- Integrate into MainLayout.jsx

---

### Day 4: Page Layouts & Containers

**Build these reusable layouts:**
1. **AuthLayout** - For login/signup pages (centered, simple)
2. **DashboardLayout** - For user dashboard (sidebar + content)
3. **PageHeader** - Reusable page title + breadcrumbs

**Time:** ~3-4 hours total

---

## 📋 PHASE 3: Feature Pages (Days 5-20) ⚡ MAIN WORK

### **Strategy: Work in Vertical Slices**
(Build complete features one by one, not all UIs then all APIs)

### Week 1 (Days 5-9): Authentication & User Profile

**Day 5-6: Auth Pages**
- Login page (screenshot → code → API integration)
- Signup page
- Forgot password

**Day 7-8: User Profile**
- View profile
- Edit profile
- Upload avatar

**Day 9: Testing**
- Test all auth flows
- Fix bugs

---

### Week 2 (Days 10-14): Property Listings (CORE FEATURE)

**Day 10-11: Browse Properties**
- Property list page (grid/list view)
- Filter sidebar (location, price, rooms, etc.)
- Search bar with autocomplete
- Pagination

**Day 12-13: Property Details**
- Image gallery/carousel
- Property info (price, location, amenities)
- Contact landlord button
- Booking/rental form

**Day 14: Testing**

---

### Week 3 (Days 15-19): Dashboard & Management

**Day 15-16: Landlord Dashboard**
- My properties list
- Add new property (multi-step form with images)
- Edit property
- Delete property

**Day 17-18: Tenant Dashboard**
- My bookings/rentals
- Favorites/saved properties
- Messages with landlords

**Day 19: Admin Panel** (if needed)
- User management
- Property approvals

---

### Day 20: Integration Buffer
- Fix integration issues
- Polish UI inconsistencies

---

## 📋 PHASE 4: Polish & Testing (Days 21-25)

**Day 21-22: UI Polish**
- Loading states for all API calls
- Error handling (toast notifications, error pages)
- Empty states (no properties found, no bookings, etc.)
- Skeleton loaders

**Day 23-24: Responsive Design**
- Test on mobile (Chrome DevTools)
- Fix layout issues
- Improve mobile navigation

**Day 25: Accessibility & Performance**
- Add alt texts to images
- Keyboard navigation
- Optimize images (compress in Figma before export)
- Code splitting (lazy load routes)

---

## 📋 PHASE 5: Testing & Deployment (Days 26-30)

**Day 26-27: Manual Testing**
- Test all user flows (signup → browse → book → dashboard)
- Test edge cases (invalid forms, network errors)
- Cross-browser testing (Chrome, Firefox, Edge)

**Day 28-29: Bug Fixes**
- Fix all critical bugs
- Final polish

**Day 30: Deployment**
- Build for production
- Deploy to Vercel/Netlify (free with GitHub Student Pack)
- Connect to backend API
- Final testing on production

---

## 🎯 SUCCESS METRICS

By day 30, you should have:
- ✅ Fully functional rental platform UI
- ✅ All pages integrated with backend
- ✅ Responsive design
- ✅ Clean, maintainable code
- ✅ Deployed and accessible online

---

## ⚡ TIME-SAVING RULES

1. **Don't reinvent the wheel**: Use React Bootstrap components as base
2. **Build → Test → Integrate** (not all UIs then integrate)
3. **Use Copilot for repetitive code** (forms, API calls, CRUD operations)
4. **Copy-paste-modify**: If two pages are similar (e.g., add/edit property), copy the first one
5. **Test as you build**: Don't wait until the end

---

## 🚨 WHAT TO AVOID

❌ Don't spend more than 2 days on design system
❌ Don't build features not in your Figma design
❌ Don't optimize too early (do it in Phase 4)
❌ Don't try to make perfect code (working > perfect)
❌ Don't skip testing phase

---

## 📊 Time Breakdown

| Phase | Days | % of Time |
|-------|------|-----------|
| Design System | 2 | 7% |
| Layouts | 2 | 7% |
| Feature Pages | 16 | 53% |
| Polish & Testing | 5 | 17% |
| Deployment & Fixes | 5 | 17% |

**Total: 30 days** ✅
