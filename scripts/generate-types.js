import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read environment variables from .env.local if not in process.env
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pvrhtweikaffgutpidid.supabase.co';
const apiKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
  console.log(`Fetching OpenAPI schema from ${supabaseUrl}/rest/v1/...`);
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch schema from Supabase: ${res.status} ${res.statusText}`);
  }

  const schema = await res.json();

  function mapType(prop) {
    if (prop.format && prop.format.startsWith('public.')) {
      const enumName = prop.format.replace('public.', '');
      return `Database['public']['Enums']['${enumName}']`;
    }
    if (prop.enum) {
      return prop.enum.map(e => JSON.stringify(e)).join(' | ');
    }
    if (prop.format === 'jsonb' || prop.format === 'json') {
      return 'Json';
    }
    if (prop.type === 'string') {
      return 'string';
    }
    if (prop.type === 'integer' || prop.type === 'number') {
      return 'number';
    }
    if (prop.type === 'boolean') {
      return 'boolean';
    }
    if (prop.format === 'bytea') {
      return 'string';
    }
    return 'unknown';
  }

  const lines = [];

  lines.push('export type Json =');
  lines.push('  | string');
  lines.push('  | number');
  lines.push('  | boolean');
  lines.push('  | null');
  lines.push('  | { [key: string]: Json | undefined }');
  lines.push('  | Json[];\n');

  lines.push('export type Database = {');
  lines.push('  public: {');
  lines.push('    Tables: {');

  const tableNames = Object.keys(schema.definitions);

  for (const tableName of tableNames) {
    const def = schema.definitions[tableName];
    const required = new Set(def.required || []);
    const properties = def.properties || {};

    lines.push(`      ${tableName}: {`);
    
    // Row
    lines.push('        Row: {');
    for (const [colName, prop] of Object.entries(properties)) {
      const tsType = mapType(prop);
      const isReq = required.has(colName);
      lines.push(`          ${colName}: ${tsType}${isReq ? '' : ' | null'};`);
    }
    lines.push('        };');

    // Insert
    lines.push('        Insert: {');
    for (const [colName, prop] of Object.entries(properties)) {
      const tsType = mapType(prop);
      const hasDefault = prop.default !== undefined;
      const isReq = required.has(colName);
      const isAuto = colName === 'id' || colName === 'created_at' || colName === 'updated_at' || colName === 'assigned_at';
      const optional = hasDefault || !isReq || isAuto;
      lines.push(`          ${colName}${optional ? '?:' : ':'} ${tsType}${isReq ? '' : ' | null'};`);
    }
    lines.push('        };');

    // Update
    lines.push('        Update: {');
    for (const [colName, prop] of Object.entries(properties)) {
      const tsType = mapType(prop);
      const isReq = required.has(colName);
      lines.push(`          ${colName}?: ${tsType}${isReq ? '' : ' | null'};`);
    }
    lines.push('        };');

    // Relationships
    lines.push('        Relationships: [');
    for (const [colName, prop] of Object.entries(properties)) {
      if (prop.description && prop.description.includes('<fk')) {
        const match = prop.description.match(/<fk table='([^']+)' column='([^']+)'\/>/);
        if (match) {
          lines.push('          {');
          lines.push(`            foreignKeyName: '${tableName}_${colName}_fkey';`);
          lines.push(`            columns: ['${colName}'];`);
          lines.push('            isOneToOne: false;');
          lines.push(`            referencedRelation: '${match[1]}';`);
          lines.push(`            referencedColumns: ['${match[2]}'];`);
          lines.push('          },');
        }
      }
    }
    lines.push('        ];');

    lines.push('      };');
  }

  lines.push('    };');
  lines.push('    Views: {');
  lines.push('      [_ in never]: never;');
  lines.push('    };');
  lines.push('    Functions: {');
  lines.push('      is_super_admin: {');
  lines.push('        Args: Record<PropertyKey, never>;');
  lines.push('        Returns: boolean;');
  lines.push('      };');
  lines.push('      has_permission: {');
  lines.push('        Args: {');
  lines.push('          p_permission_key: string;');
  lines.push('        };');
  lines.push('        Returns: boolean;');
  lines.push('      };');
  lines.push('      is_aal2: {');
  lines.push('        Args: Record<PropertyKey, never>;');
  lines.push('        Returns: boolean;');
  lines.push('      };');
  lines.push('    };');
  lines.push('    Enums: {');
  lines.push("      content_status: 'draft' | 'published' | 'archived';");
  lines.push("      vault_access_level: 'view' | 'edit';");
  lines.push("      media_kind: 'image' | 'video';");
  lines.push("      testimonial_kind: 'student' | 'parent' | 'alumni';");
  lines.push("      staff_status: 'active' | 'inactive' | 'on_leave' | 'suspended';");
  lines.push("      audit_severity: 'info' | 'warning' | 'critical';");
  lines.push('    };');
  lines.push('    CompositeTypes: {');
  lines.push('      [_ in never]: never;');
  lines.push('    };');
  lines.push('  };');
  lines.push('};\n');

  // Generic helper types
  lines.push(`type PublicSchema = Database[Extract<keyof Database, 'public'>];\n`);
  lines.push(`export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;\n`);

  lines.push(`export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;\n`);

  lines.push(`export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;\n`);

  lines.push(`export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;\n`);

  const targetDir = path.join(__dirname, '..', 'types');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(path.join(targetDir, 'database.types.ts'), lines.join('\n'), 'utf8');
  console.log(`Successfully generated types/database.types.ts with ${tableNames.length} tables/views!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
