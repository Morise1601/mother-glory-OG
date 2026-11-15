export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      active_promotions: {
        Row: {
          id: string | null;
          title: string | null;
          short_description: string | null;
          media_asset_id: string | null;
          placement: string | null;
          cta_text: string | null;
          cta_url: string | null;
          status: Database['public']['Enums']['content_status'] | null;
          is_enabled: boolean | null;
          is_permanent: boolean | null;
          starts_at: string | null;
          ends_at: string | null;
          show_as_modal: boolean | null;
          modal_delay_seconds: number | null;
          display_order: number | null;
          target_audience: Json | null;
          created_by: string | null;
          updated_by: string | null;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string | null;
          title?: string | null;
          short_description?: string | null;
          media_asset_id?: string | null;
          placement?: string | null;
          cta_text?: string | null;
          cta_url?: string | null;
          status?: Database['public']['Enums']['content_status'] | null;
          is_enabled?: boolean | null;
          is_permanent?: boolean | null;
          starts_at?: string | null;
          ends_at?: string | null;
          show_as_modal?: boolean | null;
          modal_delay_seconds?: number | null;
          display_order?: number | null;
          target_audience?: Json | null;
          created_by?: string | null;
          updated_by?: string | null;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string | null;
          title?: string | null;
          short_description?: string | null;
          media_asset_id?: string | null;
          placement?: string | null;
          cta_text?: string | null;
          cta_url?: string | null;
          status?: Database['public']['Enums']['content_status'] | null;
          is_enabled?: boolean | null;
          is_permanent?: boolean | null;
          starts_at?: string | null;
          ends_at?: string | null;
          show_as_modal?: boolean | null;
          modal_delay_seconds?: number | null;
          display_order?: number | null;
          target_audience?: Json | null;
          created_by?: string | null;
          updated_by?: string | null;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'active_promotions_media_asset_id_fkey';
            columns: ['media_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
        ];
      };
      promotions: {
        Row: {
          id: string;
          title: string;
          short_description: string | null;
          media_asset_id: string;
          placement: string;
          cta_text: string | null;
          cta_url: string | null;
          status: Database['public']['Enums']['content_status'];
          is_enabled: boolean;
          is_permanent: boolean;
          starts_at: string;
          ends_at: string | null;
          show_as_modal: boolean;
          modal_delay_seconds: number;
          display_order: number;
          target_audience: Json;
          created_by: string | null;
          updated_by: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          short_description?: string | null;
          media_asset_id: string;
          placement?: string;
          cta_text?: string | null;
          cta_url?: string | null;
          status?: Database['public']['Enums']['content_status'];
          is_enabled?: boolean;
          is_permanent?: boolean;
          starts_at?: string;
          ends_at?: string | null;
          show_as_modal?: boolean;
          modal_delay_seconds?: number;
          display_order?: number;
          target_audience: Json;
          created_by?: string | null;
          updated_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          short_description?: string | null;
          media_asset_id?: string;
          placement?: string;
          cta_text?: string | null;
          cta_url?: string | null;
          status?: Database['public']['Enums']['content_status'];
          is_enabled?: boolean;
          is_permanent?: boolean;
          starts_at?: string;
          ends_at?: string | null;
          show_as_modal?: boolean;
          modal_delay_seconds?: number;
          display_order?: number;
          target_audience?: Json;
          created_by?: string | null;
          updated_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promotions_media_asset_id_fkey';
            columns: ['media_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
        ];
      };
      vault_credentials: {
        Row: {
          id: string;
          platform_name: string;
          account_name: string;
          username_or_email: string | null;
          login_url: string | null;
          category: string | null;
          secret_ciphertext: string;
          secret_iv: string;
          secret_auth_tag: string | null;
          wrapped_dek: string;
          key_version: string;
          notes_ciphertext: string | null;
          is_active: boolean;
          last_rotated_at: string | null;
          rotation_due_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform_name: string;
          account_name: string;
          username_or_email?: string | null;
          login_url?: string | null;
          category?: string | null;
          secret_ciphertext: string;
          secret_iv: string;
          secret_auth_tag?: string | null;
          wrapped_dek: string;
          key_version: string;
          notes_ciphertext?: string | null;
          is_active?: boolean;
          last_rotated_at?: string | null;
          rotation_due_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform_name?: string;
          account_name?: string;
          username_or_email?: string | null;
          login_url?: string | null;
          category?: string | null;
          secret_ciphertext?: string;
          secret_iv?: string;
          secret_auth_tag?: string | null;
          wrapped_dek?: string;
          key_version?: string;
          notes_ciphertext?: string | null;
          is_active?: boolean;
          last_rotated_at?: string | null;
          rotation_due_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      vault_access_grants: {
        Row: {
          id: string;
          credential_id: string;
          grantee_user_id: string;
          access_level: Database['public']['Enums']['vault_access_level'];
          allow_copy: boolean;
          requires_aal2: boolean;
          expires_at: string | null;
          note: string | null;
          granted_by: string;
          revoked_by: string | null;
          revoked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          credential_id: string;
          grantee_user_id: string;
          access_level?: Database['public']['Enums']['vault_access_level'];
          allow_copy?: boolean;
          requires_aal2?: boolean;
          expires_at?: string | null;
          note?: string | null;
          granted_by: string;
          revoked_by?: string | null;
          revoked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          credential_id?: string;
          grantee_user_id?: string;
          access_level?: Database['public']['Enums']['vault_access_level'];
          allow_copy?: boolean;
          requires_aal2?: boolean;
          expires_at?: string | null;
          note?: string | null;
          granted_by?: string;
          revoked_by?: string | null;
          revoked_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vault_access_grants_credential_id_fkey';
            columns: ['credential_id'];
            isOneToOne: false;
            referencedRelation: 'vault_credentials';
            referencedColumns: ['id'];
          },
        ];
      };
      role_permissions: {
        Row: {
          role_id: string;
          permission_id: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          role_id: string;
          permission_id: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          role_id?: string;
          permission_id?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'role_permissions_permission_id_fkey';
            columns: ['permission_id'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['id'];
          },
        ];
      };
      gallery_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      media_assets: {
        Row: {
          id: string;
          kind: Database['public']['Enums']['media_kind'];
          bucket_id: string;
          object_path: string;
          original_bucket_id: string | null;
          original_object_path: string | null;
          mime_type: string;
          file_size_bytes: number | null;
          width: number | null;
          height: number | null;
          duration_seconds: number | null;
          alt_text: string | null;
          crop_data: Json;
          checksum_sha256: string | null;
          is_public: boolean;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kind: Database['public']['Enums']['media_kind'];
          bucket_id: string;
          object_path: string;
          original_bucket_id?: string | null;
          original_object_path?: string | null;
          mime_type: string;
          file_size_bytes?: number | null;
          width?: number | null;
          height?: number | null;
          duration_seconds?: number | null;
          alt_text?: string | null;
          crop_data: Json;
          checksum_sha256?: string | null;
          is_public?: boolean;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kind?: Database['public']['Enums']['media_kind'];
          bucket_id?: string;
          object_path?: string;
          original_bucket_id?: string | null;
          original_object_path?: string | null;
          mime_type?: string;
          file_size_bytes?: number | null;
          width?: number | null;
          height?: number | null;
          duration_seconds?: number | null;
          alt_text?: string | null;
          crop_data?: Json;
          checksum_sha256?: string | null;
          is_public?: boolean;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      vault_credential_versions: {
        Row: {
          id: string;
          credential_id: string;
          version_no: number;
          secret_ciphertext: string;
          secret_iv: string;
          secret_auth_tag: string | null;
          wrapped_dek: string;
          key_version: string;
          changed_by: string | null;
          changed_at: string;
        };
        Insert: {
          id?: string;
          credential_id: string;
          version_no: number;
          secret_ciphertext: string;
          secret_iv: string;
          secret_auth_tag?: string | null;
          wrapped_dek: string;
          key_version: string;
          changed_by?: string | null;
          changed_at?: string;
        };
        Update: {
          id?: string;
          credential_id?: string;
          version_no?: number;
          secret_ciphertext?: string;
          secret_iv?: string;
          secret_auth_tag?: string | null;
          wrapped_dek?: string;
          key_version?: string;
          changed_by?: string | null;
          changed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vault_credential_versions_credential_id_fkey';
            columns: ['credential_id'];
            isOneToOne: false;
            referencedRelation: 'vault_credentials';
            referencedColumns: ['id'];
          },
        ];
      };
      branches: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          phone: string | null;
          email: string | null;
          latitude: number | null;
          longitude: number | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          phone?: string | null;
          email?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          phone?: string | null;
          email?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      permissions: {
        Row: {
          id: string;
          permission_key: string;
          module: string;
          action: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          permission_key: string;
          module: string;
          action: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          permission_key?: string;
          module?: string;
          action?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
        ];
      };
      departments: {
        Row: {
          id: string;
          name: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      testimonials: {
        Row: {
          id: string;
          kind: Database['public']['Enums']['testimonial_kind'];
          person_name: string;
          person_subtitle: string | null;
          branch_id: string | null;
          rating: number | null;
          quote: string;
          source: string | null;
          source_url: string | null;
          person_image_asset_id: string | null;
          video_asset_id: string | null;
          status: Database['public']['Enums']['content_status'];
          is_featured: boolean;
          sort_order: number;
          published_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kind: Database['public']['Enums']['testimonial_kind'];
          person_name: string;
          person_subtitle?: string | null;
          branch_id?: string | null;
          rating?: number | null;
          quote: string;
          source?: string | null;
          source_url?: string | null;
          person_image_asset_id?: string | null;
          video_asset_id?: string | null;
          status?: Database['public']['Enums']['content_status'];
          is_featured?: boolean;
          sort_order?: number;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kind?: Database['public']['Enums']['testimonial_kind'];
          person_name?: string;
          person_subtitle?: string | null;
          branch_id?: string | null;
          rating?: number | null;
          quote?: string;
          source?: string | null;
          source_url?: string | null;
          person_image_asset_id?: string | null;
          video_asset_id?: string | null;
          status?: Database['public']['Enums']['content_status'];
          is_featured?: boolean;
          sort_order?: number;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'testimonials_branch_id_fkey';
            columns: ['branch_id'];
            isOneToOne: false;
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'testimonials_person_image_asset_id_fkey';
            columns: ['person_image_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'testimonials_video_asset_id_fkey';
            columns: ['video_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
        ];
      };
      designations: {
        Row: {
          id: string;
          name: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      staff_profiles: {
        Row: {
          id: string;
          employee_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_path: string | null;
          branch_id: string | null;
          department_id: string | null;
          designation_id: string | null;
          status: Database['public']['Enums']['staff_status'];
          joining_date: string | null;
          notes: string | null;
          last_login_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_path?: string | null;
          branch_id?: string | null;
          department_id?: string | null;
          designation_id?: string | null;
          status?: Database['public']['Enums']['staff_status'];
          joining_date?: string | null;
          notes?: string | null;
          last_login_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_path?: string | null;
          branch_id?: string | null;
          department_id?: string | null;
          designation_id?: string | null;
          status?: Database['public']['Enums']['staff_status'];
          joining_date?: string | null;
          notes?: string | null;
          last_login_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'staff_profiles_branch_id_fkey';
            columns: ['branch_id'];
            isOneToOne: false;
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'staff_profiles_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'staff_profiles_designation_id_fkey';
            columns: ['designation_id'];
            isOneToOne: false;
            referencedRelation: 'designations';
            referencedColumns: ['id'];
          },
        ];
      };
      staff_roles: {
        Row: {
          staff_id: string;
          role_id: string;
          is_primary: boolean;
          assigned_by: string | null;
          assigned_at: string;
        };
        Insert: {
          staff_id: string;
          role_id: string;
          is_primary?: boolean;
          assigned_by?: string | null;
          assigned_at?: string;
        };
        Update: {
          staff_id?: string;
          role_id?: string;
          is_primary?: boolean;
          assigned_by?: string | null;
          assigned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'staff_roles_staff_id_fkey';
            columns: ['staff_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'staff_roles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      promotion_events: {
        Row: {
          id: number;
          promotion_id: string;
          event_type: string;
          session_hash: string | null;
          visitor_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          promotion_id: string;
          event_type: string;
          session_hash?: string | null;
          visitor_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          promotion_id?: string;
          event_type?: string;
          session_hash?: string | null;
          visitor_hash?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promotion_events_promotion_id_fkey';
            columns: ['promotion_id'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_reads: {
        Row: {
          notification_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          notification_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {
          notification_id?: string;
          user_id?: string;
          read_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_reads_notification_id_fkey';
            columns: ['notification_id'];
            isOneToOne: false;
            referencedRelation: 'notifications';
            referencedColumns: ['id'];
          },
        ];
      };
      app_settings: {
        Row: {
          setting_key: string;
          setting_value: Json;
          is_public: boolean;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          setting_key: string;
          setting_value: Json;
          is_public?: boolean;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          setting_key?: string;
          setting_value?: Json;
          is_public?: boolean;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      roles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_system: boolean;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_system?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_system?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      gallery_items: {
        Row: {
          id: string;
          asset_id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          status: Database['public']['Enums']['content_status'];
          is_featured: boolean;
          sort_order: number;
          published_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          status?: Database['public']['Enums']['content_status'];
          is_featured?: boolean;
          sort_order?: number;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          status?: Database['public']['Enums']['content_status'];
          is_featured?: boolean;
          sort_order?: number;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'gallery_items_asset_id_fkey';
            columns: ['asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'gallery_items_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'gallery_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          role_id: string | null;
          title: string;
          message: string;
          type: string;
          action_url: string | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          role_id?: string | null;
          title: string;
          message: string;
          type?: string;
          action_url?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          role_id?: string | null;
          title?: string;
          message?: string;
          type?: string;
          action_url?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: number;
          actor_user_id: string | null;
          actor_name: string | null;
          action: string;
          module: string;
          entity_type: string | null;
          entity_id: string | null;
          severity: Database['public']['Enums']['audit_severity'];
          summary: string;
          before_data: Json | null;
          after_data: Json | null;
          metadata: Json;
          request_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_user_id?: string | null;
          actor_name?: string | null;
          action: string;
          module: string;
          entity_type?: string | null;
          entity_id?: string | null;
          severity?: Database['public']['Enums']['audit_severity'];
          summary: string;
          before_data?: Json | null;
          after_data?: Json | null;
          metadata: Json;
          request_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          actor_user_id?: string | null;
          actor_name?: string | null;
          action?: string;
          module?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          severity?: Database['public']['Enums']['audit_severity'];
          summary?: string;
          before_data?: Json | null;
          after_data?: Json | null;
          metadata?: Json;
          request_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      has_permission: {
        Args: {
          p_permission_key: string;
        };
        Returns: boolean;
      };
      is_aal2: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      content_status: 'draft' | 'published' | 'archived';
      vault_access_level: 'view' | 'edit';
      media_kind: 'image' | 'video';
      testimonial_kind: 'student' | 'parent' | 'alumni';
      staff_status: 'active' | 'inactive' | 'on_leave' | 'suspended';
      audit_severity: 'info' | 'warning' | 'critical';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
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
  : never;

export type TablesInsert<
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
  : never;

export type TablesUpdate<
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
  : never;

export type Enums<
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
  : never;
