# IMAGE UPLOAD USAGE GUIDE

## Installation

```bash
npm install
```

This will install `multer` dependency.

---

## Endpoints

### Upload Single Image
```
POST /api/upload/single
Authorization: Bearer <token>
Role: PROPRIETAIRE
Content-Type: multipart/form-data
```

**Body (form-data):**
- `image` (file) - Single image file

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "/uploads/1712234567890-123456789.jpg",
    "filename": "1712234567890-123456789.jpg",
    "size": 245678
  }
}
```

---

### Upload Multiple Images
```
POST /api/upload/multiple
Authorization: Bearer <token>
Role: PROPRIETAIRE
Content-Type: multipart/form-data
```

**Body (form-data):**
- `images` (files) - Multiple image files (max 5)

**Response:**
```json
{
  "success": true,
  "message": "5 images uploaded successfully",
  "data": [
    {
      "url": "/uploads/1712234567890-123456789.jpg",
      "filename": "1712234567890-123456789.jpg",
      "size": 245678
    },
    {
      "url": "/uploads/1712234567891-987654321.jpg",
      "filename": "1712234567891-987654321.jpg",
      "size": 189456
    }
  ]
}
```

---

### Delete Image
```
DELETE /api/upload/:filename
Authorization: Bearer <token>
Role: PROPRIETAIRE
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Validation Rules

- **Allowed formats:** jpg, jpeg, png, webp
- **Max file size:** 5MB per image
- **Max images:** 5 images per upload (multiple endpoint)

---

## Using with Property

### Create Property with Images

**Step 1:** Upload images
```
POST /api/upload/multiple
```

**Step 2:** Use returned URLs in property creation
```json
{
  "titre": "Villa moderne",
  "description": "Belle villa...",
  "prix": 500,
  "localisation": {
    "gouvernorat": "Tunis",
    "delegation": "La Marsa"
  },
  "images": [
    "/uploads/1712234567890-123456789.jpg",
    "/uploads/1712234567891-987654321.jpg"
  ],
  "bedrooms": 3,
  "bathrooms": 2,
  "maxGuests": 6
}
```

---

## Accessing Images

Images are served statically at:
```
http://localhost:5000/uploads/<filename>
```

Example:
```
http://localhost:5000/uploads/1712234567890-123456789.jpg
```

---

## Postman Testing

### Single Upload

1. Create new request: `POST http://localhost:5000/api/upload/single`
2. Headers:
   - `Authorization: Bearer <your_token>`
3. Body:
   - Select `form-data`
   - Key: `image` (type: File)
   - Value: Select an image file
4. Send

### Multiple Upload

1. Create new request: `POST http://localhost:5000/api/upload/multiple`
2. Headers:
   - `Authorization: Bearer <your_token>`
3. Body:
   - Select `form-data`
   - Key: `images` (type: File)
   - Select multiple files (hold Ctrl/Cmd)
4. Send

---

## Error Handling

### Invalid file type
```json
{
  "success": false,
  "message": "Only image files (jpg, jpeg, png, webp) are allowed"
}
```

### File too large
```json
{
  "success": false,
  "message": "File too large"
}
```

### Too many files
```json
{
  "success": false,
  "message": "Maximum 5 images allowed"
}
```

### No file uploaded
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

---

## Production Notes

For production, consider using cloud storage:
- AWS S3
- Cloudinary
- Azure Blob Storage

Replace local storage config in `config/upload.js` with cloud service SDK.
