# Hướng dẫn phát triển

## Quy ước code

### Folder structure
- `app/` - Next.js app router & API routes
- `components/` - React components
- `hooks/` - Custom React hooks
- `services/` - API client & external services
- `types/` - TypeScript interfaces
- `utils/` - Utility functions
- `constants/` - Constants & config

### Naming conventions
- Components: PascalCase (`UserTable.tsx`)
- Files: kebab-case cho utilities (`import-processing.ts`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase với `I` prefix hoặc không (tuỳ team)

## Component structure

```tsx
'use client'  // Client component marker (if needed)

import React from 'react'
import { SomeType } from '@/types'

interface ComponentProps {
  prop1: string
  prop2: number
  onAction: () => void
}

export const Component: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  onAction,
}) => {
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## Best practices

### 1. Component composition
- Chia components thành các phần nhỏ, reusable
- Props nên có clear responsibility
- Avoid prop drilling - dùng context nếu cần

### 2. State management
- Dùng `useState` cho local state
- Dùng custom hooks (`useUsers`, `useImport`) cho shared logic
- Avoid lifting state quá cao

### 3. Performance
- Memoize components nếu re-render expensive: `React.memo`
- Dùng `useCallback` cho event handlers
- Lazy load components với `React.lazy`

### 4. TypeScript
- Always define prop types
- Define interfaces cho data models
- Use strict mode: `strict: true` trong `tsconfig.json`

### 5. Error handling
- Catch API errors gracefully
- Show user-friendly messages
- Log errors (client-side)

### 6. Testing
- Write tests cho utility functions
- Test validation logic
- Snapshot test cho components (optional)

## Adding new features

### Thêm user field mới

1. **Update types** (`types/index.ts`)
```tsx
interface User {
  // ... existing fields
  newField: string
}
```

2. **Update API mock** (`app/api/users/route.ts`)
```tsx
const mockUsers: User[] = [
  {
    // ... existing fields
    newField: 'value',
  },
]
```

3. **Update table** (`components/UserTable.tsx`)
```tsx
<th>New Field</th>
// ...
<td>{user.newField}</td>
```

4. **Update import** (`utils/importProcessing.ts`)
```tsx
interface ImportedUser {
  // ... existing fields
  newField: string
}
```

### Thêm application mới

1. **Update constants** (`constants/index.ts`)
```tsx
export const APPLICATIONS = [
  // ... existing
  { id: 'NewApp', name: 'New Application' },
]
```

2. **Update type** (`types/index.ts`)
```tsx
type ApplicationName = 'E-Office' | 'PPC Tool' | 'HRHire' | 'NewApp'
```

3. Modal sẽ tự động render trong `ApplicationModal.tsx`

### Thêm filter mới

1. **Update UserFilters type** (`types/index.ts`)
```tsx
interface UserFilters {
  // ... existing
  newFilter: string
}
```

2. **Update SearchBar** (`components/SearchBar.tsx`)
```tsx
const [newFilter, setNewFilter] = useState('')

// Thêm select/input cho filter
// Call onSearch
```

3. **Update API** (`app/api/users/route.ts`)
```tsx
const newFilter = searchParams.get('newFilter') || ''
const matchNewFilter = !newFilter || user.someField === newFilter
```

## Common patterns

### Fetching data
```tsx
const { users, loading, error, refetch } = useUsers(filters)
```

### Form handling
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

### Modal with confirmation
```tsx
const [isOpen, setIsOpen] = useState(false)
const [confirming, setConfirming] = useState(false)

const handleConfirm = async () => {
  setConfirming(true)
  try {
    await apiCall()
    setIsOpen(false)
  } finally {
    setConfirming(false)
  }
}
```

## Debugging tips

### Check state
```tsx
console.log('State:', state)
console.log('Props:', props)
```

### Browser DevTools
- React DevTools extension
- Network tab để check API calls
- Console untuk errors

### API testing
```tsx
// Test API endpoint
fetch('/api/users')
  .then(r => r.json())
  .then(console.log)
```

## Commit messages

Follow conventional commits:
```
feat: add import functionality
fix: handle API error in status update
refactor: extract validation logic
docs: update README
test: add validation tests
```

## Performance monitoring

### Vercel Analytics
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  )
}
```

### Next.js Speed Insights
Add to `layout.tsx`:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
```

## Environment variables

- `.env.local` - local development
- `.env.production` - production
- `.env.example` - template (commit vào Git)

Never commit `.env.local` hoặc `.env.production`

## Git workflow

```bash
# Feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: description"

# Push
git push origin feature/new-feature

# Create PR on GitHub
```

## Useful commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Test
npm test
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## Questions?

- Check README.md cho overview
- Check DEPLOYMENT_GUIDE.md cho deployment
- Check code comments
- Open an issue on GitHub
