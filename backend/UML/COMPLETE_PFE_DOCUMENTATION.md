# REN&GO PLATFORM - STRUCTURED UML DOCUMENTATION
## Academic PFE Report Format

---

# CHAPTER 2: USE CASE DIAGRAM

## System: Ren&Go (House Rental Platform)

### Actors

1. **CLIENT**
   - End user who books properties
   - Can register, search, book, pay, review, and message property owners

2. **PROPRIETAIRE** (Property Owner)
   - User who owns and manages rental properties
   - Can create properties, manage reservations, confirm payments, and communicate with clients

3. **ADMIN** (Administrator)
   - System administrator with full access
   - Can manage users, properties, payments, and monitor system activities

---

### Use Cases by Package

#### 1. AUTHENTICATION PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-AUTH-01 | Register | CLIENT, PROPRIETAIRE | User creates account with email, phone, password, and role |
| UC-AUTH-02 | Verify Email | CLIENT, PROPRIETAIRE | User clicks verification link sent to email |
| UC-AUTH-03 | Login | CLIENT, PROPRIETAIRE, ADMIN | User authenticates with email and password (requires verified email) |
| UC-AUTH-04 | Logout | CLIENT, PROPRIETAIRE, ADMIN | User terminates session |

**Relationship**: Register <<include>> Verify Email

---

#### 2. PROPERTY MANAGEMENT PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-PROP-01 | Browse Properties | CLIENT | View all active properties with pagination |
| UC-PROP-02 | View Property Details | CLIENT | View detailed information about a specific property |
| UC-PROP-03 | Filter by Type | CLIENT | Filter properties by type (MAISON, VILLA, APPARTEMENT, etc.) |
| UC-PROP-04 | Check Availability | CLIENT | Check if property is available for selected dates |
| UC-PROP-05 | Create Property | PROPRIETAIRE | Add new property with details, images, and pricing |
| UC-PROP-06 | Update Property | PROPRIETAIRE | Edit existing property information |
| UC-PROP-07 | Delete Property | PROPRIETAIRE, ADMIN | Remove property from system |
| UC-PROP-08 | Manage All Properties | ADMIN | View and manage all properties in system |

**Relationships**:
- Browse Properties <<include>> Check Availability
- Filter by Type <<extend>> Browse Properties

---

#### 3. RESERVATION MANAGEMENT PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-RES-01 | Make Reservation | CLIENT | Create booking for property with dates and guest count |
| UC-RES-02 | Cancel Reservation | CLIENT | Cancel existing reservation (subject to cancellation policy) |
| UC-RES-03 | View My Reservations | CLIENT | View all personal reservations |
| UC-RES-04 | View Property Reservations | PROPRIETAIRE | View reservations for owned properties |
| UC-RES-05 | View All Reservations | ADMIN | Monitor all system reservations |

**Relationship**: Make Reservation <<include>> Check Availability

---

#### 4. PAYMENT MANAGEMENT PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-PAY-01 | Pay Online | CLIENT | Process online payment for reservation |
| UC-PAY-02 | Confirm Cash Payment | PROPRIETAIRE | Manually confirm cash payment received |
| UC-PAY-03 | View My Payments | CLIENT | View personal payment history |
| UC-PAY-04 | View Received Payments | PROPRIETAIRE | View payments for owned properties |
| UC-PAY-05 | Monitor Payments | ADMIN | Monitor all platform payments and commissions |

---

#### 5. REVIEW MANAGEMENT PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-REV-01 | Leave Review | CLIENT | Write review for completed reservation |
| UC-REV-02 | View Reviews | CLIENT, PROPRIETAIRE | View reviews for properties |
| UC-REV-03 | Delete Review | ADMIN | Remove inappropriate reviews |

**Relationship**: Leave Review <<extend>> View My Reservations

---

#### 6. WISHLIST MANAGEMENT PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-WISH-01 | Add to Wishlist | CLIENT | Save property to personal wishlist |
| UC-WISH-02 | Remove from Wishlist | CLIENT | Remove property from wishlist |
| UC-WISH-03 | View My Wishlist | CLIENT | View all saved properties |

---

#### 7. MESSAGING SYSTEM PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-MSG-01 | Send Message | CLIENT, PROPRIETAIRE | Send message to other party (CLIENT ↔ PROPRIETAIRE only) |
| UC-MSG-02 | View Messages | CLIENT, PROPRIETAIRE | View conversation history |
| UC-MSG-03 | Mark Message as Read | CLIENT, PROPRIETAIRE | Mark received message as read |

**Business Rule**: Only CLIENT ↔ PROPRIETAIRE communication allowed. ADMIN cannot send or receive messages.

**Relationship**: Send Message <<include>> Receive Notifications

---

#### 8. NOTIFICATION SYSTEM PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-NOT-01 | Receive Notifications | CLIENT, PROPRIETAIRE | Automatically receive system notifications |
| UC-NOT-02 | View All Notifications | CLIENT, PROPRIETAIRE | View notification history |
| UC-NOT-03 | Mark Notification as Read | CLIENT, PROPRIETAIRE | Mark notification as read |

**Notification Triggers**:
- New reservation created
- Reservation cancelled
- Payment successful
- New review posted
- New message received

---

#### 9. ADMINISTRATION PACKAGE

| Use Case ID | Use Case Name | Actor(s) | Description |
|-------------|---------------|----------|-------------|
| UC-ADM-01 | Manage Users | ADMIN | Manage user accounts |
| UC-ADM-02 | Activate/Deactivate User | ADMIN | Enable or disable user accounts |
| UC-ADM-03 | View All Users | ADMIN | View all registered users |
| UC-ADM-04 | Monitor System | ADMIN | Monitor platform health and metrics |

---

### Use Case Diagram Summary

**Total Use Cases**: 36
**Total Actors**: 3 (CLIENT, PROPRIETAIRE, ADMIN)
**Include Relationships**: 3
**Extend Relationships**: 2

---

# CHAPTER 3: CLASS DIAGRAM

## System Entities Overview

The Ren&Go platform consists of **9 core entities** that represent the business domain:

1. User
2. Property
3. Reservation
4. Payment
5. Review
6. Wishlist
7. Notification
8. Message
9. Config

---

## 3.1 USER CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| name | String | Required | User full name |
| email | String | Required, Unique | User email address |
| phone | String | Required, Unique | Phone number (+216XXXXXXXX or 2XXXXXXX) |
| password | String | Required, Hashed | Encrypted password (bcrypt) |
| role | Enum | Required | CLIENT, PROPRIETAIRE, or ADMIN |
| isActive | Boolean | Default: true | Account status |
| isVerified | Boolean | Default: false | Email verification status |
| verificationToken | String | Nullable, Hashed | Email verification token (SHA256) |
| verificationTokenExpires | Date | Nullable | Token expiration timestamp |
| createdAt | Date | Auto-generated | Account creation date |
| updatedAt | Date | Auto-updated | Last modification date |

### Methods

- `register()`: Create new user account
- `login()`: Authenticate and generate JWT token
- `verifyEmail(token)`: Verify email address
- `comparePassword(password)`: Compare hashed passwords
- `generateVerificationToken()`: Create verification token

### Relationships

- **1 to 0..*** with Property (as owner)
- **1 to 0..*** with Reservation (as client)
- **1 to 0..*** with Review (as reviewer)
- **1 to 0..1** with Wishlist
- **1 to 0..*** with Notification (as recipient)
- **1 to 0..*** with Message (as sender)
- **1 to 0..*** with Message (as receiver)

---

## 3.2 PROPERTY CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| titre | String | Required | Property title |
| description | String | Required | Detailed description |
| prix | Number | Required | Nightly price |
| localisation.gouvernorat | String | Required | Tunisian governorate |
| localisation.delegation | String | Required | Tunisian delegation |
| images | String[] | Required | Array of image URLs |
| bedrooms | Number | Required | Number of bedrooms |
| bathrooms | Number | Required | Number of bathrooms |
| maxGuests | Number | Required | Maximum guest capacity |
| type | Enum | Required | MAISON, MAISON_DHOTES, VILLA, APPARTEMENT, COTTAGE |
| cancellationDelay | Number | Required | 24 or 48 hours |
| owner | ObjectId | FK → User | Property owner reference |
| isActive | Boolean | Default: true | Property availability status |
| createdAt | Date | Auto-generated | Creation timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Methods

- `create()`: Add new property
- `update()`: Modify property details
- `delete()`: Remove property
- `checkAvailability(dateDebut, dateFin)`: Check date availability
- `calculateTotalPrice(nights)`: Calculate total booking cost

### Relationships

- **0..*** to 1 with User (owner)
- **1 to 0..*** with Reservation
- **1 to 0..*** with Review
- **0..*** to 0..1 with Wishlist (many-to-many)

---

## 3.3 RESERVATION CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| property | ObjectId | FK → Property | Reserved property |
| client | ObjectId | FK → User | Client who booked |
| dateDebut | Date | Required | Check-in date |
| dateFin | Date | Required | Check-out date |
| guests | Number | Required | Number of guests |
| totalPrice | Number | Required | Total booking cost |
| status | Enum | Required | EN_ATTENTE, CONFIRMEE, ANNULEE |
| paymentMethod | Enum | Required | CASH or ONLINE |
| createdAt | Date | Auto-generated | Booking timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Methods

- `create()`: Create new reservation
- `cancel()`: Cancel reservation
- `confirm()`: Confirm reservation
- `checkOverlap(otherReservation)`: Detect date conflicts
- `calculateNights()`: Calculate number of nights
- `isExpired()`: Check if cancellation deadline passed

### Overlap Detection Algorithm

```
Overlap exists if:
  existingReservation.dateDebut < newReservation.dateFin
  AND
  existingReservation.dateFin > newReservation.dateDebut
```

### Relationships

- **0..*** to 1 with Property
- **0..*** to 1 with User (client)
- **1 to 0..*** with Payment
- **1 to 0..1** with Review (one review per reservation)
- **1 to 0..*** with Message (optional context)

---

## 3.4 PAYMENT CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| reservation | ObjectId | FK → Reservation | Associated reservation |
| client | ObjectId | FK → User | Paying client |
| amount | Number | Required | Payment amount |
| method | Enum | Required | CASH or ONLINE |
| status | Enum | Required | SUCCESS or FAILED |
| commissionAmount | Number | Required | Platform commission |
| netAmount | Number | Required | Amount after commission |
| createdAt | Date | Auto-generated | Payment timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Methods

- `processOnlinePayment()`: Handle online payment
- `confirmCashPayment()`: Confirm manual payment
- `calculateCommission(rate)`: Calculate platform fee

### Commission Calculation

```
commissionAmount = amount × (commissionRate / 100)
netAmount = amount - commissionAmount
```

Default commission rate: 10% (stored in Config)

### Relationships

- **0..*** to 1 with Reservation
- **0..*** to 1 with User (client)

---

## 3.5 REVIEW CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| reservation | ObjectId | FK → Reservation, Unique | Reviewed reservation |
| reviewer | ObjectId | FK → User | Client who wrote review |
| property | ObjectId | FK → Property | Reviewed property |
| rating | Number | Required, 1-5 | Star rating |
| comment | String | Required, Max 1000 | Review text |
| createdAt | Date | Auto-generated | Review timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Business Rules

- Only CLIENT can write reviews
- Only for CONFIRMEE (completed) reservations
- One review per reservation (unique constraint)

### Methods

- `create()`: Write new review
- `delete()`: Remove review
- `validate()`: Check review eligibility

### Relationships

- **0..1** to 1 with Reservation
- **0..*** to 1 with User (reviewer)
- **0..*** to 1 with Property

---

## 3.6 WISHLIST CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| user | ObjectId | FK → User, Unique | Wishlist owner |
| properties | ObjectId[] | FK → Property | Array of saved properties |
| createdAt | Date | Auto-generated | Creation timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Business Rules

- One wishlist per user (unique constraint on user)
- Prevents duplicate properties ($addToSet)
- Only CLIENT can have wishlist

### Methods

- `addProperty(propertyId)`: Add property to wishlist
- `removeProperty(propertyId)`: Remove property from wishlist
- `getWishlist()`: Retrieve user wishlist

### Relationships

- **0..1** to 1 with User
- **1 to 0..*** with Property (many-to-many)

---

## 3.7 NOTIFICATION CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| user | ObjectId | FK → User | Notification recipient |
| type | Enum | Required | RESERVATION, PAYMENT, REVIEW, SYSTEM |
| message | String | Required | Notification content |
| isRead | Boolean | Default: false | Read status |
| relatedId | ObjectId | Nullable | Polymorphic reference |
| relatedModel | Enum | Nullable | Reservation, Payment, Review, Property |
| createdAt | Date | Auto-generated | Creation timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Polymorphic Relationships

The `relatedId` field can reference:
- **Reservation** (when type = RESERVATION)
- **Payment** (when type = PAYMENT)
- **Review** (when type = REVIEW)
- **Property** (when type = SYSTEM)

### Methods

- `create()`: Create notification
- `markAsRead()`: Mark as read
- `markAllAsRead()`: Mark all user notifications as read
- `delete()`: Remove notification

### Notification Triggers

| Trigger Event | Recipient | Type | Message |
|---------------|-----------|------|---------|
| New reservation | Property owner | RESERVATION | "New reservation for [property]" |
| Reservation cancelled | Property owner | RESERVATION | "Reservation cancelled" |
| Payment successful | Client | PAYMENT | "Payment successful" |
| Payment received | Property owner | PAYMENT | "Payment received for [property]" |
| New review | Property owner | REVIEW | "New review for [property]" |
| New message | Message receiver | SYSTEM | "New message from [sender]" |

### Relationships

- **0..*** to 1 with User
- **0..*** to 0..1 with Reservation (polymorphic)
- **0..*** to 0..1 with Payment (polymorphic)
- **0..*** to 0..1 with Review (polymorphic)
- **0..*** to 0..1 with Property (polymorphic)

---

## 3.8 MESSAGE CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| sender | ObjectId | FK → User | Message sender |
| receiver | ObjectId | FK → User | Message receiver |
| reservation | ObjectId | FK → Reservation, Nullable | Optional reservation context |
| content | String | Required, Max 1000 | Message text (sanitized) |
| isRead | Boolean | Default: false | Read status |
| createdAt | Date | Auto-generated | Send timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Business Rules

- **CLIENT ↔ PROPRIETAIRE communication ONLY**
- ADMIN cannot send or receive messages
- User cannot message himself
- Content sanitized (HTML stripped, whitespace normalized)
- Reservation link validated (both parties must be involved)

### Methods

- `send()`: Send new message
- `markAsRead()`: Mark as read
- `getConversation(userId)`: Get all messages between two users
- `getConversationList()`: Get all conversations with unread counts

### Relationships

- **0..*** to 1 with User (as sender)
- **0..*** to 1 with User (as receiver)
- **0..*** to 0..1 with Reservation (optional context)

---

## 3.9 CONFIG CLASS

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier |
| key | String | Required, Unique | Configuration key (e.g., "commission") |
| commissionRate | Number | Required, 0-100 | Platform commission percentage |
| createdAt | Date | Auto-generated | Creation timestamp |
| updatedAt | Date | Auto-updated | Last update timestamp |

### Static Methods

- `getCommissionRate()`: Retrieve current commission rate
- `updateCommissionRate(rate)`: Update commission percentage

### Usage

Currently stores platform commission rate (default: 10%). Used by Payment calculations.

---

## Relationship Summary

| Relationship | Multiplicity | Type |
|--------------|--------------|------|
| User → Property | 1 to 0..* | Composition |
| User → Reservation | 1 to 0..* | Association |
| Property → Reservation | 1 to 0..* | Association |
| Reservation → Payment | 1 to 0..* | Composition |
| Reservation → Review | 1 to 0..1 | Composition |
| Property → Review | 1 to 0..* | Association |
| User → Review | 1 to 0..* | Association |
| User → Wishlist | 1 to 0..1 | Composition |
| Wishlist → Property | 1 to 0..* | Association (many-to-many) |
| User → Notification | 1 to 0..* | Composition |
| Notification → [Polymorphic] | 0..* to 0..1 | Association |
| User → Message (sender) | 1 to 0..* | Composition |
| User → Message (receiver) | 1 to 0..* | Association |
| Reservation → Message | 1 to 0..* | Association |

**Total Relationships**: 15

---

# CHAPTER 4: SEQUENCE DIAGRAMS

## 4.1 User Registration + Email Verification

### Participants

- **Actor**: User (CLIENT or PROPRIETAIRE)
- **Frontend**: Frontend Application
- **Backend**: Backend API Server
- **Database**: MongoDB Database
- **Email Service**: Nodemailer Email Service

### Sequence Flow

#### Phase 1: Registration

1. **User → Frontend**: Fill registration form (name, email, phone, password, role)
2. **Frontend → Frontend**: Validate input (client-side)
3. **Frontend → Backend**: POST /api/auth/register
4. **Backend → Backend**: Validate input (server-side)
5. **Backend → Backend**: Sanitize phone number
6. **Backend → Database**: Check if email exists
   - **ALT**: Email exists → Return 400 "User already exists"
7. **Backend → Database**: Check if phone exists
   - **ALT**: Phone exists → Return 400 "Phone already exists"
8. **Backend → Backend**: Hash password (bcrypt, salt=10)
9. **Backend → Backend**: Generate verification token (crypto.randomBytes)
10. **Backend → Backend**: Hash verification token (SHA256)
11. **Backend → Backend**: Set token expiry (1 hour)
12. **Backend → Database**: Create new User (isVerified=false, verificationToken hashed)
13. **Backend → Email Service**: Send verification email with plain token
14. **Email Service → User**: Email sent to inbox
15. **Backend → Frontend**: 201 Created {user data, message: "Check your email"}
16. **Frontend → User**: Show success "Please verify your email"

#### Phase 2: Email Verification

1. **User → User**: Open email, click verification link
2. **User → Frontend**: GET /verify-email?token=XYZ
3. **Frontend → Backend**: GET /api/auth/verify-email?token=XYZ
4. **Backend → Backend**: Hash received token (SHA256)
5. **Backend → Database**: Find user with verificationToken=hashedToken AND verificationTokenExpires > now
   - **ALT**: Token invalid/expired → Return 400 "Invalid or expired token"
6. **Backend → Database**: Update user (isVerified=true, clear token)
7. **Backend → Frontend**: 200 OK {success: true, message: "Email verified"}
8. **Frontend → User**: Show success "Email verified. You can now login"

### Key Security Features

- Password hashed with bcrypt (salt rounds: 10)
- Verification token hashed with SHA256 before storage
- Token expires after 1 hour
- Email and phone uniqueness enforced
- Login blocked until email verified

---

## 4.2 Property Reservation (with Availability Check)

### Participants

- **Actor**: CLIENT
- **Frontend**: Frontend Application
- **Backend**: Backend API Server
- **Database**: MongoDB Database

### Sequence Flow

#### Phase 1: Browse Properties

1. **CLIENT → Frontend**: Browse properties (optional: filter by type)
2. **Frontend → Backend**: GET /api/properties?type=VILLA
3. **Backend → Database**: Find properties (filter by type, isActive=true)
4. **Database → Backend**: Return properties list
5. **Backend → Frontend**: 200 OK {properties[]}
6. **Frontend → CLIENT**: Display properties

#### Phase 2: View Property Details

1. **CLIENT → Frontend**: Click on property
2. **Frontend → Backend**: GET /api/properties/:propertyId
3. **Backend → Database**: Find property by ID
4. **Database → Backend**: Return property details
5. **Backend → Frontend**: 200 OK {property}
6. **Frontend → CLIENT**: Display details (prix, bedrooms, maxGuests, etc.)

#### Phase 3: Check Availability

1. **CLIENT → Frontend**: Select dates (dateDebut, dateFin)
2. **Frontend → Frontend**: Validate dates (dateDebut < dateFin)
3. **Frontend → Backend**: GET /api/reservations/check-availability?propertyId=X&dateDebut=Y&dateFin=Z
4. **Backend → Backend**: Parse and validate dates
5. **Backend → Database**: Find overlapping reservations:
   ```
   WHERE property=X
   AND status IN (EN_ATTENTE, CONFIRMEE)
   AND dateDebut < dateFin
   AND dateFin > dateDebut
   ```
6. **Database → Backend**: Return overlapping reservations
   - **ALT Overlap Found**: Backend → Frontend 200 {available: false} → CLIENT sees "Not available"
   - **ALT No Overlap**: Backend → Frontend 200 {available: true} → CLIENT sees "Available", booking enabled

#### Phase 4: Make Reservation

1. **CLIENT → Frontend**: Fill reservation form (dates, guests, paymentMethod)
2. **Frontend → Frontend**: Validate (guests <= maxGuests, paymentMethod selected)
3. **Frontend → Backend**: POST /api/reservations {propertyId, dateDebut, dateFin, guests, paymentMethod}
4. **Backend → Backend**: Authenticate user (JWT token), validate role = CLIENT
5. **Backend → Backend**: Validate dates (24h minimum advance)
6. **Backend → Database**: Find property by ID
   - **ALT**: Property not found/inactive → 404 "Property not available"
7. **Backend → Backend**: Validate guests <= maxGuests
8. **Backend → Database**: Check overlap again (double-check in transaction)
   - **ALT**: Overlap found → 409 Conflict "Property not available for selected dates"
9. **Backend → Backend**: Calculate totalPrice (nights × prix)
10. **Backend → Database**: Create reservation (status=EN_ATTENTE, paymentMethod)
11. **Backend → Database**: Get property owner
12. **Backend → Database**: Create notification for owner {type: RESERVATION, message: "New reservation for [property]"}
13. **Backend → Frontend**: 201 Created {reservation}
14. **Frontend → CLIENT**: Show success "Reservation created! Please proceed to payment"

### Overlap Detection Algorithm

```javascript
// Mathematical overlap detection
dateDebut < newReservation.dateFin 
AND 
dateFin > newReservation.dateDebut
```

### Business Rules

- Minimum 24h advance booking required
- Guests cannot exceed maxGuests
- Only CLIENT can create reservations
- Availability checked twice (before form submission and during creation)
- Property owner notified immediately

---

## 4.3 Online Payment

### Participants

- **Actor**: CLIENT
- **Frontend**: Frontend Application
- **Backend**: Backend API Server
- **Database**: MongoDB Database
- **Payment Gateway**: External Payment Service

### Sequence Flow

#### Phase 1: View Reservation

1. **CLIENT → Frontend**: View reservation details
2. **Frontend → Backend**: GET /api/reservations/:reservationId
3. **Backend → Backend**: Authenticate user (JWT token)
4. **Backend → Database**: Find reservation by ID
5. **Database → Backend**: Return reservation
6. **Backend → Frontend**: 200 OK {reservation}
7. **Frontend → CLIENT**: Display reservation (totalPrice, status, paymentMethod)

#### Phase 2: Initiate Payment

1. **CLIENT → Frontend**: Click "Pay Now"
2. **Frontend → Backend**: POST /api/payments/online {reservationId}
3. **Backend → Backend**: Authenticate user (JWT token)
4. **Backend → Database**: Find reservation by ID
   - **ALT**: Reservation not found → 404 "Reservation not found"
5. **Backend → Backend**: Validate:
   - User is CLIENT
   - User owns reservation
   - Status = EN_ATTENTE
   - PaymentMethod = ONLINE
   - **ALT**: Validation failed → 400 "Invalid payment request"
6. **Backend → Database**: Check if payment already exists
   - **ALT**: Payment exists → 400 "Payment already processed"

#### Phase 3: Process Payment (MongoDB Transaction)

1. **Backend → Database**: Get commission rate from Config (e.g., 10%)
2. **Backend → Backend**: Calculate:
   - commissionAmount = amount × (rate / 100)
   - netAmount = amount - commissionAmount
3. **Backend → Database**: **Start MongoDB transaction**
4. **Backend → Database**: Create Payment record {reservation, client, amount, method: ONLINE, status: PENDING, commissionAmount, netAmount}
5. **Backend → Payment Gateway**: Process payment {amount, clientInfo}
6. **Payment Gateway → Payment Gateway**: Process transaction (validate card, charge)

   **ALT 1: Payment Failed**
   7a. **Payment Gateway → Backend**: Payment failed {error: "Insufficient funds"}
   8a. **Backend → Database**: Update Payment (status = FAILED)
   9a. **Backend → Database**: Rollback transaction
   10a. **Backend → Frontend**: 400 "Payment failed: Insufficient funds"
   11a. **Frontend → CLIENT**: Show payment error

   **ALT 2: Payment Successful**
   7b. **Payment Gateway → Backend**: Payment successful {transactionId}
   8b. **Backend → Database**: Update Payment (status = SUCCESS)
   9b. **Backend → Database**: Update Reservation (status = CONFIRMEE)
   10b. **Backend → Database**: Create notification for CLIENT {type: PAYMENT, message: "Payment successful"}
   11b. **Backend → Database**: Get property owner
   12b. **Backend → Database**: Create notification for PROPRIETAIRE {type: PAYMENT, message: "Payment received"}
   13b. **Backend → Database**: Commit transaction
   14b. **Backend → Frontend**: 201 Created {payment, message: "Payment successful"}
   15b. **Frontend → CLIENT**: Show success "Payment successful! Reservation confirmed"

### Transaction Safety

- **MongoDB Transaction** ensures atomicity:
  - If payment gateway fails → rollback all changes
  - If payment succeeds → commit all changes together
- Prevents race conditions (double payment attempts)
- Commission automatically calculated and tracked

### Commission Calculation

```javascript
commissionRate = 10% (from Config)
commissionAmount = amount × 0.10
netAmount = amount - commissionAmount

Example: 
  Reservation = 1000 DT
  Commission = 100 DT (platform)
  Net Amount = 900 DT (to PROPRIETAIRE)
```

---

## 4.4 Messaging System (Send Message Flow)

### Participants

- **Actor**: User (CLIENT or PROPRIETAIRE)
- **Frontend**: Frontend Application
- **Backend**: Backend API Server
- **Database**: MongoDB Database

### Sequence Flow

#### Phase 1: View Conversations

1. **User → Frontend**: Go to Messages page
2. **Frontend → Backend**: GET /api/messages
3. **Backend → Backend**: Authenticate user (JWT token)
4. **Backend → Database**: Aggregate conversations:
   - Group by sender/receiver
   - Get last message per conversation
   - Count unread messages
5. **Database → Backend**: Return conversations list
6. **Backend → Frontend**: 200 OK {conversations: [{lastMessage, otherUser, unreadCount}]}
7. **Frontend → User**: Display conversations list

#### Phase 2: Select Conversation

**ALT: Existing Conversation**
1. **User → Frontend**: Click on conversation
2. **Frontend → Backend**: GET /api/messages/:userId
3. **Backend → Backend**: Authenticate user (JWT token)
4. **Backend → Database**: Find all messages:
   ```
   WHERE (sender=currentUser AND receiver=userId)
   OR (sender=userId AND receiver=currentUser)
   ORDER BY createdAt ASC
   ```
5. **Database → Backend**: Return messages
6. **Backend → Frontend**: 200 OK {messages[]}
7. **Frontend → User**: Display conversation history

#### Phase 3: Send Message

1. **User → Frontend**: Type message (optional: link to reservation)
2. **Frontend → Frontend**: Validate:
   - Content not empty
   - Content <= 1000 characters
3. **Frontend → Backend**: POST /api/messages {receiverId, content, reservationId?}
4. **Backend → Backend**: Authenticate user (JWT token), get sender role and ID
5. **Backend → Backend**: Validate sender is not ADMIN
   - **ALT**: Sender is ADMIN → 403 "Admin cannot send messages"
6. **Backend → Database**: Find receiver by ID
   - **ALT**: Receiver not found → 404 "Receiver not found"
7. **Backend → Backend**: Validate receiver is not ADMIN
   - **ALT**: Receiver is ADMIN → 403 "Cannot send message to Admin"
8. **Backend → Backend**: Validate sender ≠ receiver
   - **ALT**: Same user → 400 "Cannot message yourself"
9. **Backend → Backend**: Validate role pair using `isClientProprietairePair()`:
   ```javascript
   Valid pairs:
   - CLIENT → PROPRIETAIRE ✓
   - PROPRIETAIRE → CLIENT ✓
   - CLIENT → CLIENT ✗
   - PROPRIETAIRE → PROPRIETAIRE ✗
   ```
   - **ALT**: Invalid pair → 403 "Only CLIENT ↔ PROPRIETAIRE communication allowed"

#### Phase 4: Reservation Validation (Optional)

**IF reservationId provided:**
1. **Backend → Database**: Find reservation by ID
   - **ALT**: Reservation not found → 404 "Reservation not found"
2. **Backend → Backend**: Validate sender or receiver involved in reservation
   - Check: reservation.client = sender OR reservation.property.owner = sender
   - **ALT**: Not involved → 403 "Not involved in reservation"

#### Phase 5: Create Message

1. **Backend → Backend**: Sanitize content:
   - Strip HTML tags
   - Normalize whitespace
2. **Backend → Database**: Create Message {sender, receiver, content, reservation?, isRead=false}
3. **Backend → Database**: Create notification for receiver:
   ```
   {user: receiverId, type: SYSTEM,
    message: "New message from [sender]",
    relatedModel: Message, relatedId: messageId}
   ```
4. **Backend → Frontend**: 201 Created {message}
5. **Frontend → User**: Show "Message sent", update conversation view

#### Phase 6: Receiver Views Message (Note)

When receiver opens conversation, messages are marked as read via:
```
PUT /api/messages/:messageId/read
```

### Business Rules Enforced

1. **CLIENT ↔ PROPRIETAIRE ONLY**
   - No CLIENT-to-CLIENT communication
   - No PROPRIETAIRE-to-PROPRIETAIRE communication
   - ADMIN completely excluded from messaging

2. **Role Validation Function**
   ```javascript
   isClientProprietairePair(roleA, roleB):
     return (roleA === 'CLIENT' && roleB === 'PROPRIETAIRE') ||
            (roleA === 'PROPRIETAIRE' && roleB === 'CLIENT')
   ```

3. **Content Sanitization**
   - Remove HTML tags (prevent XSS)
   - Normalize whitespace
   - Max 1000 characters

4. **Reservation Context**
   - Optional but recommended
   - Must involve both sender and receiver
   - Validated on backend

### Notification Integration

Every message sent triggers:
- Real-time notification for receiver
- Notification type: SYSTEM
- relatedModel: Message
- relatedId: messageId

---

## Summary

### System Architecture Overview

**Total Classes**: 9
**Total Use Cases**: 36
**Total Sequence Diagrams**: 4

### Key Design Patterns

1. **MVC Architecture**: Models, Controllers, Routes separated
2. **Repository Pattern**: Database access abstracted
3. **Middleware Pattern**: Authentication, role checking, rate limiting
4. **Strategy Pattern**: Payment methods (CASH vs ONLINE)
5. **Observer Pattern**: Notification system (event-driven)
6. **Polymorphic Association**: Notification relatedId

### Security Features

- JWT authentication with email verification
- Password hashing (bcrypt, salt=10)
- Verification token hashing (SHA256)
- Input validation and sanitization
- Rate limiting (login: 5/15min, register: 3/hour)
- NoSQL injection prevention
- MongoDB transactions for payment integrity
- Role-based access control (CLIENT, PROPRIETAIRE, ADMIN)

### Business Logic Highlights

- **Overlap Prevention**: Mathematical date range comparison
- **Commission System**: Configurable platform fee (default 10%)
- **Messaging Restrictions**: CLIENT ↔ PROPRIETAIRE only
- **Review Policy**: One review per reservation, CLIENT only
- **Cancellation Policy**: 24h or 48h per property
- **Email Verification**: Required before login

---

END OF STRUCTURED DOCUMENTATION
