---
name: real-estate-crm
description: Guidelines, data modeling standards, and workflows for building and optimizing the Real Estate CRM system (InmobiliariaToto), covering rental tracking, payment collection, client communication, and database design.
---
# Real Estate CRM Development Guidelines

This skill defines instructions for building and modifying the real estate CRM system (InmobiliariaToto).

## Domain Logic & System Components

### 1. Rentals & Contracts (Alquileres y Contratos)
- Track active contracts, start and end dates, rental amounts, currencies, and updating indexes.
- Manage owners, tenants, and property relationships.

### 2. Payment Collection & Ledgers (Cobranzas y Finanzas)
- Record transaction types: rent payments, commissions, expenses, and sales.
- Ensure correct database entry using standard types defined in `FinancialRecordType`.

### 3. Customer Communication (Información a Clientes)
- Model client interactions (e.g. email, call, meeting).
- Enable sharing rent statements or receipts with clients.

## Technical Integration with Prisma & Supabase
- Always validate database schemas using Prisma client.
- When querying database models, handle relations carefully.
- Store Supabase credentials securely using environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
