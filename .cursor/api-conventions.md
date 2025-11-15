# API Conventions

## Structure
```typescript
export async function GET(request: Request) {
  // 1. Auth
  const session = await getServerSession();
  if (!session) return error(401);
  
  // 2. Validate
  const params = validate(searchParams);
  
  // 3. Query
  const data = await prisma.model.findMany();
  
  // 4. Response
  return NextResponse.json(data);
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Error Format
```json
{
  "error": "Message",
  "issues": []
}
```

