export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          // ...
        };
        Insert: { ... };
        Update: { ... };
      };
      // ...more tables
    };
    Views: {};
    Functions: {};
  };
};
    