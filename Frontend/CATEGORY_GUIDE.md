# 📋 How to Add New Categories to FeeShay

This guide explains how to add new categories to your FeeShay freelance marketplace app.

## 🎨 Step 1: Add Category Colors (Required for Jobs)

**File:** `Frontend/app/constants/Colors.ts`

### For Job Categories (with colored badges):
1. Open `Frontend/app/constants/Colors.ts`
2. Find the `CATEGORY_COLORS` object
3. Add your new category with background and text colors:

```typescript
export const CATEGORY_COLORS = {
  // ... existing categories ...
  
  // ADD YOUR NEW CATEGORY HERE:
  Fitness: { bg: '#F0FDF4', text: '#15803D' },    // Green theme
  Fashion: { bg: '#FDF2F8', text: '#BE185D' },    // Pink theme
  Food: { bg: '#FFFBEB', text: '#D97706' },       // Amber theme
  
  default: { bg: COLORS.muted, text: COLORS.textSecondary },
} as const;
```

4. Add the category key to `CATEGORY_COLOR_KEYS` array:

```typescript
const CATEGORY_COLOR_KEYS = [
  'Design', 'Tech', 'Writing', 'Marketing', 'Photography', 'Music', 
  'Animation', 'Consulting', 'Translation', 'Legal', 'Finance', 
  'Health', 'Education', 'Gaming',
  // ADD NEW CATEGORIES HERE:
  'Fitness', 'Fashion', 'Food'
] as const;
```

### 🎨 Color Guidelines:
- Use **light backgrounds** (#F0F9FF, #FDF2F8, etc.)
- Use **darker text colors** (#0284C7, #BE185D, etc.)
- Ensure good contrast for accessibility
- Choose colors that represent the category well

## 📊 Step 2: Add Mock Data

**File:** `Frontend/app/Home.tsx`

### For Jobs (Services):
Add new job objects to the `jobs` array:

```typescript
const jobs = [
  // ... existing jobs ...
  
  // ADD NEW JOB WITH YOUR CATEGORY:
  {
    id: '9',
    title: 'Personal Training Program',
    image: 'https://your-image-url.com',
    sellerAvatar: 'https://avatar-url.com',
    sellerName: 'John F.',
    rating: 4.8,
    ratingCount: 67,
    category: 'Fitness',  // ← Must match Colors.ts exactly
    price: 120,
  },
];
```

### For Talents (Freelancers):
Add new talent objects to the `talents` array:

```typescript
const talents = [
  // ... existing talents ...
  
  // ADD NEW TALENT:
  {
    id: '6',
    name: 'Alex Johnson',
    title: 'Fitness Coach & Nutritionist',
    location: 'Miami, US',
    rating: 4.9,
    price: 45,
    avatar: 'https://avatar-url.com',
    category: 'Fitness Training',  // ← Can be different from job categories
  },
];
```

## 🔄 Step 3: Automatic Features

Once you add categories, these features work automatically:

✅ **Dynamic Category Tabs** - Categories appear in the horizontal scroll
✅ **Category Filtering** - Users can filter by your new categories  
✅ **Category Counts** - Shows number of items in each category
✅ **Colored Badges** - Job cards get the colors you defined
✅ **Tab Switching** - Categories update when switching Talents/Jobs

## 🌈 Available Color Themes

Choose from these pre-made color combinations:

```typescript
// Blue themes
{ bg: '#DBEAFE', text: '#1E40AF' }  // Light blue
{ bg: '#EFF6FF', text: '#2563EB' }  // Sky blue
{ bg: '#F0F9FF', text: '#0284C7' }  // Lighter blue

// Purple themes  
{ bg: '#EDE9FE', text: '#7C3AED' }  // Light purple
{ bg: '#F3E8FF', text: '#9333EA' }  // Violet

// Green themes
{ bg: '#DCFCE7', text: '#16A34A' }  // Light green
{ bg: '#ECFDF5', text: '#059669' }  // Emerald
{ bg: '#F0FDF4', text: '#15803D' }  // Fresh green

// Pink themes
{ bg: '#FCE7F3', text: '#BE185D' }  // Light pink
{ bg: '#FDF2F8', text: '#BE185D' }  // Softer pink
{ bg: '#FDF4FF', text: '#A21CAF' }  // Fuchsia

// Orange/Yellow themes
{ bg: '#FEF3C7', text: '#D97706' }  // Amber
{ bg: '#FFF7ED', text: '#EA580C' }  // Orange
{ bg: '#FEFCE8', text: '#CA8A04' }  // Yellow
{ bg: '#FFFBEB', text: '#D97706' }  // Light amber

// Neutral themes
{ bg: '#F1F5F9', text: '#475569' }  // Slate
```

## 🚀 Example: Adding "Fitness" Category

### 1. Add to Colors.ts:
```typescript
export const CATEGORY_COLORS = {
  // ... existing ...
  Fitness: { bg: '#F0FDF4', text: '#15803D' },
  // ...
} as const;

const CATEGORY_COLOR_KEYS = [
  // ... existing ...
  'Fitness'
] as const;
```

### 2. Add to Home.tsx:
```typescript
// Add to jobs array:
{
  id: '9',
  title: 'Personal Training Program',
  image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fitness.png',
  sellerAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
  sellerName: 'John F.',
  rating: 4.8,
  ratingCount: 67,
  category: 'Fitness',
  price: 120,
}
```

### 3. Result:
- ✅ "Fitness" appears in category tabs
- ✅ Green badge appears on fitness job cards  
- ✅ Users can filter by Fitness category
- ✅ Category count shows correctly

## 🔮 Future: Backend Integration

When you connect to a backend:

1. **Remove mock data** from `Home.tsx`
2. **Keep color definitions** in `Colors.ts`
3. **Fetch categories** from your API
4. **Categories will automatically** get colors from your system

## ❓ Troubleshooting

**Category not showing colored badge?**
- Check category name matches exactly between `Home.tsx` and `Colors.ts`
- Make sure category is added to `CATEGORY_COLOR_KEYS` array

**Category not appearing in tabs?**
- Check that you have data with that category in your mock arrays
- Verify the dynamic category generation is working

**Colors look wrong?**
- Test color contrast at https://webaim.org/resources/contrastchecker/
- Use lighter backgrounds with darker text for best results

---

🎉 **That's it!** Your new categories will automatically work with the entire FeeShay system. 