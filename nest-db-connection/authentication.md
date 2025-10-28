# Understanding Decorators, Strategies, and Guards in Authentication Flow

Let me break down how these three components work together at each step of the authentication process.

## The Three Components

### 1. **Decorators** - Metadata Markers
Think of decorators as "labels" or "instructions" you attach to your routes. They don't actually do the authentication work—they just provide information about what should happen.

### 2. **Strategies** - Authentication Logic
Strategies contain the actual logic for validating tokens. They define *how* to authenticate a user.

### 3. **Guards** - Security Checkpoints
Guards are the enforcers. They intercept requests and decide whether to allow them through, using strategies to validate credentials.

---

## How They Work Together at Each Step

### **Step 1 & 2: Sign Up / Sign In** (`/auth/signup`, `/auth/signin`)

```typescript
@Public()  // ← DECORATOR: Marks route as public
@Post('signup')
signUpLocal(@Body() createAuthDto: CreateAuthDto) {
  return this.authService.signUpLocal(createAuthDto);
}
```

**Flow:**
1. **Request arrives** → "I want to sign up"
2. **AtGuard intercepts** (applied globally) → "Let me check if this is protected"
3. **Guard checks decorator** → Sees `@Public()` metadata
4. **Guard decision** → "This is public, allow it through without checking tokens"
5. **No strategy is used** → Authentication not needed

**Key Point:** The decorator tells the guard to skip authentication entirely.

---

### **Step 3: Access Protected Resources**

```typescript
@Get('books')  // No @Public() decorator
findAll() {
  return this.booksService.findAll();
}
```

**Flow:**
1. **Request arrives** with `Authorization: Bearer <access-token>`
2. **AtGuard intercepts** → "Is this public?"
3. **No @Public() decorator found** → "This is protected, I need to validate"
4. **Guard invokes AtStrategy** → "Strategy, validate this token!"
5. **AtStrategy extracts token** from Authorization header
   ```typescript
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
   ```
6. **AtStrategy verifies token** using the secret key
   ```typescript
   secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET')
   ```
7. **If valid, Strategy's validate() runs:**
   ```typescript
   validate(payload: JWTPayload) {
     return payload; // Attaches {sub: userId, email: ...} to request.user
   }
   ```
8. **Guard allows request through** → Controller method executes with `request.user` populated

**Key Point:** Guard uses Strategy to do the validation work, then attaches user data to the request.

---

### **Step 4: Refresh Tokens** (`/auth/refresh`)

```typescript
@UseGuards(RtGuard)  // ← DECORATOR: Use specific guard (not the global AtGuard)
@Get('refresh')
refreshTokens(@Query('id') id: string, @Req() req: RequestWithUser) {
  const user = req.user;
  return this.authService.refreshTokens(id, user.refreshToken);
}
```

**Flow:**
1. **Request arrives** with `Authorization: Bearer <refresh-token>`
2. **RtGuard intercepts** (explicitly applied via `@UseGuards()` decorator)
3. **RtGuard invokes RfStrategy** → "Validate this refresh token"
4. **RfStrategy extracts token** from Authorization header
5. **RfStrategy verifies token** using the **refresh token secret**
   ```typescript
   secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET')
   ```
6. **RfStrategy's validate() extracts the token itself:**
   ```typescript
   validate(req: Request, payload: any) {
     const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
     return { ...payload, refreshToken }; // Attaches payload + the actual token
   }
   ```
7. **Guard allows request through** → Controller can access `user.refreshToken`

**Key Point:** Different guard + different strategy for refresh tokens. The strategy also passes the raw token value (not just the decoded payload) to the controller.

---

### **Step 5: Sign Out** (`/auth/signout/:id`)

```typescript
@UseGuards(AtGuard)  // ← DECORATOR: Explicitly requires access token
@Get('signout/:id')
signOut(@Param('id') id: string) {
  return this.authService.signOut(id);
}
```

**Flow:**
1. **Request arrives** with access token
2. **AtGuard intercepts** (explicitly applied)
3. **Same flow as Step 3** → AtStrategy validates access token
4. **If valid** → User can sign out (invalidate their refresh token)

**Key Point:** Sign out requires valid access token to prove identity before invalidating tokens.

---

## Visual Summary: How They Work Together

```
Request → [GUARD] → [STRATEGY] → [DECORATOR INFO] → Controller
          ↓           ↓            ↓
      "Should I      "Is token    "Am I public?
       check?"        valid?"      What data needed?"
```

### Example Flow Diagram:

```
1. REQUEST ARRIVES
   ↓
2. GUARD INTERCEPTS (AtGuard or RtGuard)
   ↓
   Check: Is there a @Public() decorator?
   ├─ YES → Allow through (skip step 3-4)
   └─ NO  → Continue to step 3
   ↓
3. GUARD CALLS STRATEGY (AtStrategy or RfStrategy)
   ↓
   Strategy extracts token from header
   Strategy verifies token with secret
   Strategy decodes payload
   ↓
4. STRATEGY RETURNS USER DATA
   ↓
   Guard attaches data to request.user
   ↓
5. CONTROLLER RECEIVES REQUEST
   ↓
   Can access @GetCurrentUserId() or @Req() req.user
```

---

## Key Relationships

| Component | Role | Example |
|-----------|------|---------|
| **Decorator** | Provides metadata/instructions | `@Public()` → "Skip auth" |
| **Strategy** | Validates credentials | `AtStrategy` → "Verify JWT token" |
| **Guard** | Enforces access control | `AtGuard` → "Check decorator, call strategy, decide" |

**The critical insight:** Guards are the orchestrators. They check decorators for instructions and delegate validation work to strategies. The guard makes the final decision: allow or deny.