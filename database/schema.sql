--
-- PostgreSQL database dump
--

\restrict 2N6NvE2eBhXSZAZE7DnoX1KSl9aQGKurZkopwx6shlYqqDduFcpsWD1QGf8B1RN

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auto_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auto_identifier_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: company_customer_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_customer_fields (
    id integer NOT NULL,
    field_key character varying(100) NOT NULL,
    field_label character varying(100) NOT NULL,
    field_type character varying(50) DEFAULT 'text'::character varying NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    display_order integer NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    field_group character varying(30) DEFAULT 'customer'::character varying,
    show_in jsonb DEFAULT '{"list": true, "dialog": true, "import": true, "search": true, "profile": true}'::jsonb,
    sort_order integer DEFAULT 0,
    storage_key character varying(100)
);


--
-- Name: company_customer_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_customer_fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_customer_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_customer_fields_id_seq OWNED BY public.company_customer_fields.id;


--
-- Name: company_customer_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_customer_status (
    id integer NOT NULL,
    status_name character varying(100) NOT NULL,
    status_color character varying(20) DEFAULT '#1976d2'::character varying NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_system boolean DEFAULT false NOT NULL
);


--
-- Name: company_customer_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_customer_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_customer_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_customer_status_id_seq OWNED BY public.company_customer_status.id;


--
-- Name: custom_field_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_field_values (
    id integer NOT NULL,
    field_id integer NOT NULL,
    record_id integer NOT NULL,
    field_value text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: custom_field_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_field_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_field_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_field_values_id_seq OWNED BY public.custom_field_values.id;


--
-- Name: custom_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_fields (
    id integer NOT NULL,
    module_key character varying(50) NOT NULL,
    field_key character varying(100) NOT NULL,
    field_label character varying(100) NOT NULL,
    field_type character varying(50) DEFAULT 'text'::character varying NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    is_unique boolean DEFAULT false NOT NULL,
    is_identifier boolean DEFAULT false NOT NULL,
    is_searchable boolean DEFAULT true NOT NULL,
    is_importable boolean DEFAULT true NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    show_in jsonb DEFAULT '{"form": true, "list": true, "import": true, "search": true, "profile": true}'::jsonb NOT NULL,
    options jsonb,
    display_order integer DEFAULT 0 NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: custom_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_fields_id_seq OWNED BY public.custom_fields.id;


--
-- Name: customer_external_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_external_sources (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    source_type character varying(50) NOT NULL,
    external_id text,
    external_row integer,
    sheet_name character varying(255),
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    service_id integer
);


--
-- Name: customer_external_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_external_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_external_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_external_sources_id_seq OWNED BY public.customer_external_sources.id;


--
-- Name: customer_field_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_field_values (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    field_id integer NOT NULL,
    field_value text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: customer_field_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_field_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_field_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_field_values_id_seq OWNED BY public.customer_field_values.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(50) NOT NULL,
    email character varying(255),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    customer_code character varying(50),
    service_date date,
    service character varying(100),
    engineer character varying(100),
    remark text,
    amount numeric(10,2),
    source character varying(30),
    import_batch_id integer,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp without time zone,
    deleted_by integer
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: dashboard_widget_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_widget_settings (
    id integer NOT NULL,
    widget_id character varying(100) NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: dashboard_widget_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_widget_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_widget_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_widget_settings_id_seq OWNED BY public.dashboard_widget_settings.id;


--
-- Name: google_sheet_mappings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.google_sheet_mappings (
    id integer NOT NULL,
    spreadsheet_id character varying(255) NOT NULL,
    sheet_name character varying(255) NOT NULL,
    mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    import_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    export_mapping jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: google_sheet_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.google_sheet_mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: google_sheet_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.google_sheet_mappings_id_seq OWNED BY public.google_sheet_mappings.id;


--
-- Name: identifier_generators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identifier_generators (
    id integer NOT NULL,
    generator_key character varying(100) NOT NULL,
    current_number bigint DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: identifier_generators_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.identifier_generators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: identifier_generators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.identifier_generators_id_seq OWNED BY public.identifier_generators.id;


--
-- Name: import_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.import_batches (
    id integer NOT NULL,
    source character varying(30) NOT NULL,
    file_name character varying(255),
    total_rows integer DEFAULT 0,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: import_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.import_batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: import_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.import_batches_id_seq OWNED BY public.import_batches.id;


--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_settings (
    id integer NOT NULL,
    notification_type_id integer NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    threshold numeric,
    days_before integer,
    priority character varying(20) DEFAULT 'normal'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: notification_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_settings_id_seq OWNED BY public.notification_settings.id;


--
-- Name: notification_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_types (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    category character varying(50) DEFAULT 'general'::character varying,
    default_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: notification_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_types_id_seq OWNED BY public.notification_types.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    notification_type_id integer,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    priority character varying(20) DEFAULT 'normal'::character varying,
    is_read boolean DEFAULT false,
    reference_type character varying(100),
    reference_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true NOT NULL,
    resolved_at timestamp without time zone
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer,
    product_id integer,
    quantity integer NOT NULL,
    total numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(30) NOT NULL,
    payment_status character varying(20) DEFAULT 'PAID'::character varying,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: service_field_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_field_values (
    id integer NOT NULL,
    service_id integer NOT NULL,
    field_id integer NOT NULL,
    field_value text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: service_field_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_field_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_field_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_field_values_id_seq OWNED BY public.service_field_values.id;


--
-- Name: service_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_products (
    id integer NOT NULL,
    service_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT service_products_quantity_check CHECK ((quantity > 0))
);


--
-- Name: service_products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_products_id_seq OWNED BY public.service_products.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    service_date date,
    service character varying(100),
    engineer character varying(100),
    remark text,
    amount numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    customer_code character varying(50) NOT NULL,
    received_amount numeric(10,2) DEFAULT 0 NOT NULL,
    pending_amount numeric(10,2) DEFAULT 0 NOT NULL,
    status character varying(50) DEFAULT 'Pending'::character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(150),
    mobile character varying(20),
    role character varying(50) DEFAULT 'Admin'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: company_customer_fields id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_customer_fields ALTER COLUMN id SET DEFAULT nextval('public.company_customer_fields_id_seq'::regclass);


--
-- Name: company_customer_status id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_customer_status ALTER COLUMN id SET DEFAULT nextval('public.company_customer_status_id_seq'::regclass);


--
-- Name: custom_field_values id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_field_values ALTER COLUMN id SET DEFAULT nextval('public.custom_field_values_id_seq'::regclass);


--
-- Name: custom_fields id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_fields ALTER COLUMN id SET DEFAULT nextval('public.custom_fields_id_seq'::regclass);


--
-- Name: customer_external_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_external_sources ALTER COLUMN id SET DEFAULT nextval('public.customer_external_sources_id_seq'::regclass);


--
-- Name: customer_field_values id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_field_values ALTER COLUMN id SET DEFAULT nextval('public.customer_field_values_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: dashboard_widget_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_widget_settings ALTER COLUMN id SET DEFAULT nextval('public.dashboard_widget_settings_id_seq'::regclass);


--
-- Name: google_sheet_mappings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_sheet_mappings ALTER COLUMN id SET DEFAULT nextval('public.google_sheet_mappings_id_seq'::regclass);


--
-- Name: identifier_generators id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identifier_generators ALTER COLUMN id SET DEFAULT nextval('public.identifier_generators_id_seq'::regclass);


--
-- Name: import_batches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_batches ALTER COLUMN id SET DEFAULT nextval('public.import_batches_id_seq'::regclass);


--
-- Name: notification_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings ALTER COLUMN id SET DEFAULT nextval('public.notification_settings_id_seq'::regclass);


--
-- Name: notification_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_types ALTER COLUMN id SET DEFAULT nextval('public.notification_types_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: service_field_values id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_field_values ALTER COLUMN id SET DEFAULT nextval('public.service_field_values_id_seq'::regclass);


--
-- Name: service_products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_products ALTER COLUMN id SET DEFAULT nextval('public.service_products_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: company_customer_fields company_customer_fields_field_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_customer_fields
    ADD CONSTRAINT company_customer_fields_field_key_key UNIQUE (field_key);


--
-- Name: company_customer_fields company_customer_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_customer_fields
    ADD CONSTRAINT company_customer_fields_pkey PRIMARY KEY (id);


--
-- Name: company_customer_status company_customer_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_customer_status
    ADD CONSTRAINT company_customer_status_pkey PRIMARY KEY (id);


--
-- Name: company_customer_status company_customer_status_status_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_customer_status
    ADD CONSTRAINT company_customer_status_status_name_key UNIQUE (status_name);


--
-- Name: custom_field_values custom_field_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_field_values
    ADD CONSTRAINT custom_field_values_pkey PRIMARY KEY (id);


--
-- Name: custom_field_values custom_field_values_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_field_values
    ADD CONSTRAINT custom_field_values_unique UNIQUE (field_id, record_id);


--
-- Name: custom_fields custom_fields_field_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_fields
    ADD CONSTRAINT custom_fields_field_key_unique UNIQUE (module_key, field_key);


--
-- Name: custom_fields custom_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_fields
    ADD CONSTRAINT custom_fields_pkey PRIMARY KEY (id);


--
-- Name: customer_external_sources customer_external_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_external_sources
    ADD CONSTRAINT customer_external_sources_pkey PRIMARY KEY (id);


--
-- Name: customer_field_values customer_field_values_customer_id_field_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_field_values
    ADD CONSTRAINT customer_field_values_customer_id_field_id_key UNIQUE (customer_id, field_id);


--
-- Name: customer_field_values customer_field_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_field_values
    ADD CONSTRAINT customer_field_values_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: dashboard_widget_settings dashboard_widget_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_widget_settings
    ADD CONSTRAINT dashboard_widget_settings_pkey PRIMARY KEY (id);


--
-- Name: dashboard_widget_settings dashboard_widget_settings_widget_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_widget_settings
    ADD CONSTRAINT dashboard_widget_settings_widget_id_key UNIQUE (widget_id);


--
-- Name: google_sheet_mappings google_sheet_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_sheet_mappings
    ADD CONSTRAINT google_sheet_mappings_pkey PRIMARY KEY (id);


--
-- Name: google_sheet_mappings google_sheet_mappings_spreadsheet_id_sheet_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_sheet_mappings
    ADD CONSTRAINT google_sheet_mappings_spreadsheet_id_sheet_name_key UNIQUE (spreadsheet_id, sheet_name);


--
-- Name: identifier_generators identifier_generators_generator_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identifier_generators
    ADD CONSTRAINT identifier_generators_generator_key_key UNIQUE (generator_key);


--
-- Name: identifier_generators identifier_generators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identifier_generators
    ADD CONSTRAINT identifier_generators_pkey PRIMARY KEY (id);


--
-- Name: import_batches import_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_batches
    ADD CONSTRAINT import_batches_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_notification_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_notification_type_id_key UNIQUE (notification_type_id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: notification_types notification_types_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_types
    ADD CONSTRAINT notification_types_key_key UNIQUE (key);


--
-- Name: notification_types notification_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_types
    ADD CONSTRAINT notification_types_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: service_field_values service_field_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_field_values
    ADD CONSTRAINT service_field_values_pkey PRIMARY KEY (id);


--
-- Name: service_field_values service_field_values_service_field_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_field_values
    ADD CONSTRAINT service_field_values_service_field_unique UNIQUE (service_id, field_id);


--
-- Name: service_products service_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_products
    ADD CONSTRAINT service_products_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_customer_external_sources_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_external_sources_customer ON public.customer_external_sources USING btree (customer_id);


--
-- Name: idx_customer_external_sources_external; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_external_sources_external ON public.customer_external_sources USING btree (source_type, external_id, sheet_name, external_row);


--
-- Name: idx_customer_external_sources_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_customer_external_sources_unique ON public.customer_external_sources USING btree (source_type, external_id, sheet_name, external_row);


--
-- Name: custom_field_values custom_field_values_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_field_values
    ADD CONSTRAINT custom_field_values_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.custom_fields(id) ON DELETE CASCADE;


--
-- Name: customer_external_sources customer_external_sources_customer_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_external_sources
    ADD CONSTRAINT customer_external_sources_customer_fk FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: customer_external_sources customer_external_sources_service_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_external_sources
    ADD CONSTRAINT customer_external_sources_service_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: customer_field_values customer_field_values_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_field_values
    ADD CONSTRAINT customer_field_values_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: customer_field_values customer_field_values_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_field_values
    ADD CONSTRAINT customer_field_values_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.company_customer_fields(id) ON DELETE CASCADE;


--
-- Name: customers customers_import_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_import_batch_id_fkey FOREIGN KEY (import_batch_id) REFERENCES public.import_batches(id) ON DELETE SET NULL;


--
-- Name: service_products fk_product; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_products
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: service_products fk_service; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_products
    ADD CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: notification_settings notification_settings_notification_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_notification_type_id_fkey FOREIGN KEY (notification_type_id) REFERENCES public.notification_types(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_notification_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_notification_type_id_fkey FOREIGN KEY (notification_type_id) REFERENCES public.notification_types(id) ON DELETE SET NULL;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: orders orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: service_field_values service_field_values_field_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_field_values
    ADD CONSTRAINT service_field_values_field_fk FOREIGN KEY (field_id) REFERENCES public.company_customer_fields(id) ON DELETE CASCADE;


--
-- Name: service_field_values service_field_values_service_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_field_values
    ADD CONSTRAINT service_field_values_service_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 2N6NvE2eBhXSZAZE7DnoX1KSl9aQGKurZkopwx6shlYqqDduFcpsWD1QGf8B1RN

