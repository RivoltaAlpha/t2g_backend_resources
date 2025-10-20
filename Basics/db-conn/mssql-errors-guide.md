# 🔌 MSSQL Backend Connection Guide

A comprehensive guide to troubleshoot and configure SQL Server authentication for your backend application.

---

## 📋 Prerequisites

Before starting, ensure you have:
- SQL Server Management Studio (SSMS) installed
- Access to your SQL Server instance (TRAF)
- Administrative privileges on the SQL Server

---

## 🔍 Step 1: Check SA Account Status

First, check if the `sa` account exists and is properly configured.

```sql
-- Check if sa account exists and is enabled
SELECT name, is_disabled, is_policy_checked, is_expiration_checked
FROM sys.sql_logins 
WHERE name = 'sa'

-- Check if sa account is locked out
SELECT name, is_policy_checked, is_expiration_checked, 
       is_locked, lockout_time
FROM sys.sql_logins 
WHERE name = 'sa'
```

**What to look for:**
- `is_disabled` should be `0` (enabled)
- `is_locked` should be `0` (not locked)

---

## 🔑 Step 2: Reset SA Password

The password `2205` might not be the current password. Reset it:

```sql
-- Enable and reset sa password
ALTER LOGIN sa ENABLE
ALTER LOGIN sa WITH PASSWORD = '2205'
```

---

## 👤 Step 3: Alternative Solution - Create a New SQL Login

If the sa account continues to have issues, create a new SQL Server login:

```sql
-- Create a new SQL login
CREATE LOGIN dbuser WITH PASSWORD = 'Password123!'

-- Switch to your events database
USE events

-- Create user for the login
CREATE USER dbuser FOR LOGIN dbuser

-- Grant permissions
ALTER ROLE db_owner ADD MEMBER dbuser
```

**Update your `.env` file:**

```bash
PORT=8000
SQL_SERVER=TRAF
SQL_USER=dbuser
SQL_PWD=Password123!
SQL_DB=events
SQL_ENCRYPT=true
```

---

## 🔐 Enable Mixed Mode Authentication

### Using SQL Server Management Studio (SSMS)

1. Open SQL Server Management Studio and connect to your SQL Server instance (TRAF)
2. Right-click on the server name in Object Explorer and select **Properties**
3. Go to the **Security** page in the Server Properties dialog
4. Under "Server authentication", select **SQL Server and Windows Authentication mode**
5. Click **OK** to apply the changes
6. **Restart the SQL Server service** for the changes to take effect

---

## ✅ Verify the Change

After making the change and restarting SQL Server, verify it worked:

```sql
SELECT CASE SERVERPROPERTY('IsIntegratedSecurityOnly') 
    WHEN 1 THEN 'Windows Authentication Only' 
    WHEN 0 THEN 'Mixed Mode (Windows and SQL Server Authentication)' 
END AS AuthenticationMode
```

**Expected result:** Should return "Mixed Mode (Windows and SQL Server Authentication)"

---

## 🔧 Check SQL Server Configuration

Run these commands in SQL Server Management Studio to verify:

### Check if Windows authentication is enabled:

```sql
SELECT CASE SERVERPROPERTY('IsIntegratedSecurityOnly') 
    WHEN 1 THEN 'Windows Authentication Only' 
    WHEN 0 THEN 'Mixed Mode' 
END AS AuthenticationMode
```

### Check if the user exists:

```sql
SELECT name, type_desc, is_disabled 
FROM sys.server_principals 
WHERE name = 'your_username'  -- Replace with your username
```

### Grant access if needed:

```sql
USE events
CREATE USER your_username FOR LOGIN your_username
ALTER ROLE db_owner ADD MEMBER your_username
```

---

## 🎯 Most Common Solution

The most common solution is to either:
- Use SQL Server authentication with a proper SQL login, OR
- Ensure Windows authentication is properly configured on your SQL Server instance

---

## 🔍 Verify SA Account Configuration

Since you've confirmed the Windows login exists and you've updated your .env file to use the sa account, the authentication issue should be resolved. However, check these things:

### 1. Verify the sa account is enabled and password is correct

Run this query in SQL Server Management Studio to check if the sa account is enabled:

```sql
SELECT name, is_disabled 
FROM sys.sql_logins 
WHERE name = 'sa'
```

If `is_disabled` returns `1`, you'll need to enable it:

```sql
ALTER LOGIN sa ENABLE
ALTER LOGIN sa WITH PASSWORD = '2205'  -- or your chosen password
```

---

### 2. Ensure Mixed Mode Authentication is enabled

Since you're using SQL Server authentication (sa), verify that your SQL Server instance allows SQL Server authentication. Run this query:

```sql
SELECT CASE SERVERPROPERTY('IsIntegratedSecurityOnly') 
    WHEN 1 THEN 'Windows Authentication Only' 
    WHEN 0 THEN 'Mixed Mode' 
END AS AuthenticationMode
```

If it shows "Windows Authentication Only", you'll need to change it to Mixed Mode through SQL Server Configuration Manager or SQL Server Management Studio.

---

### 3. Grant database access to sa

Make sure the sa account has access to your events database:

```sql
USE events

-- Create user for sa if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'sa')
BEGIN
    CREATE USER sa FOR LOGIN sa
END

-- Grant permissions
ALTER ROLE db_owner ADD MEMBER sa
```

---

### 4. Test your connection

With your current `.env` configuration using sa, restart your application and see if the connection works now. 

**Current `.env` setup:**
```bash
PORT=8000
SQL_SERVER=TRAF
SQL_USER=sa
SQL_PWD=2205
SQL_DB=events
SQL_ENCRYPT=true
```

If you still get errors, the issue might be with the password `2205` for the sa account.

---

## 💡 Important Note

The fact that the Windows user exists suggests your SQL Server is properly configured for Windows authentication, but since you're now using SQL Server authentication with sa, make sure that account is properly set up.

---

## 🐛 Common Issues & Solutions

### Issue: "Login failed for user 'sa'"
**Solutions:**
- Verify password is correct
- Check if account is enabled (see verification steps above)
- Ensure Mixed Mode authentication is enabled
- Restart SQL Server after configuration changes

### Issue: "Cannot open database 'events'"
**Solutions:**
- Verify the database name is correct
- Grant user access to the database (see Step 3)
- Check if database exists: `SELECT name FROM sys.databases`

### Issue: "Login is locked out"
**Solution:**
```sql
-- Unlock the account
ALTER LOGIN sa WITH CHECK_POLICY = OFF
ALTER LOGIN sa WITH CHECK_POLICY = ON
```

---

## 🔒 Security Best Practices

1. **Avoid using SA in production** - Create dedicated users with minimal required permissions
2. **Use strong passwords** - Minimum 12 characters with mixed case, numbers, and symbols
3. **Enable password policy** - Set `CHECK_POLICY = ON` for SQL logins
4. **Use Windows Authentication when possible** - More secure than SQL authentication
5. **Regularly rotate passwords** - Especially for privileged accounts

---

## 📚 Additional Resources

- [SQL Server Authentication Modes](https://docs.microsoft.com/en-us/sql/relational-databases/security/choose-an-authentication-mode)
- [Creating Database Users](https://docs.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-database-user)
- [SQL Server Security Best Practices](https://docs.microsoft.com/en-us/sql/relational-databases/security/sql-server-security-best-practices)

---

**Need help?** If you encounter issues not covered in this guide, check your SQL Server error logs at: `C:\Program Files\Microsoft SQL Server\MSSQL[version]\MSSQL\LOG\ERRORLOG`