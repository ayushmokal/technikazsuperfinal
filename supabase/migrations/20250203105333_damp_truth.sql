-- Get all tables and their columns
SELECT 
    t.table_name,
    array_agg(
        c.column_name || ' ' || 
        c.data_type || 
        CASE 
            WHEN c.character_maximum_length IS NOT NULL 
            THEN '(' || c.character_maximum_length || ')'
            ELSE ''
        END || 
        CASE WHEN c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END
    ) as columns,
    obj_description(pgclass.oid, 'pg_class') as table_description
FROM 
    information_schema.tables t
    JOIN information_schema.columns c ON t.table_name = c.table_name
    LEFT JOIN pg_class pgclass ON t.table_name = pgclass.relname
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
GROUP BY 
    t.table_name, pgclass.oid
ORDER BY 
    t.table_name;

-- Get all functions
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition,
    obj_description(p.oid, 'pg_proc') as function_description
FROM 
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public';

-- Get all triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM 
    information_schema.triggers
WHERE 
    trigger_schema = 'public'
ORDER BY 
    event_object_table,
    trigger_name;

-- Get all indexes
SELECT
    tablename as table_name,
    indexname as index_name,
    indexdef as index_definition
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;

-- Get RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, 
    policyname;

-- Get roles and their permissions
SELECT 
    r.rolname as role_name,
    r.rolsuper as is_superuser,
    r.rolinherit as inherits_privileges,
    r.rolcreaterole as can_create_roles,
    r.rolcreatedb as can_create_databases,
    r.rolcanlogin as can_login,
    r.rolreplication as has_replication_privileges,
    r.rolconnlimit as connection_limit,
    r.rolvaliduntil as valid_until,
    ARRAY(
        SELECT b.rolname
        FROM pg_catalog.pg_auth_members m
        JOIN pg_catalog.pg_roles b ON (m.roleid = b.oid)
        WHERE m.member = r.oid
    ) as member_of
FROM 
    pg_catalog.pg_roles r
WHERE 
    r.rolname !~ '^pg_'
ORDER BY 
    1;

-- Get table permissions
SELECT 
    grantor,
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM 
    information_schema.table_privileges 
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name,
    privilege_type,
    grantee;

-- Get sequence information
SELECT 
    c.relname as sequence_name,
    u.usename as owner,
    g.grantee,
    g.privilege_type
FROM 
    pg_class c
    JOIN pg_user u ON c.relowner = u.usesysid
    LEFT JOIN information_schema.usage_privileges g ON 
        g.object_name = c.relname AND
        g.object_type = 'SEQUENCE' AND
        g.object_schema = 'public'
WHERE 
    c.relkind = 'S' AND
    c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY 
    c.relname,
    g.grantee;

-- Get extensions
SELECT 
    extname as extension_name,
    extversion as version,
    obj_description(oid, 'pg_extension') as description
FROM 
    pg_extension
ORDER BY 
    extname;

-- Get foreign keys
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name;