--
-- PostgreSQL database dump
--

\restrict 4XjAQbUApbFdccV9W9ivQvBwn8hGcofo2HTyZ3HN8nGPLXaiwWOe1wW9Td70dg8

-- Dumped from database version 17.6 (Debian 17.6-1)
-- Dumped by pg_dump version 17.6 (Debian 17.6-1)

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
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms (
    id integer NOT NULL,
    sno integer NOT NULL,
    form_number character varying(50) NOT NULL,
    description text NOT NULL,
    category character varying(100) NOT NULL,
    pdf_filename character varying(255),
    pdf_size_kb numeric(10,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: forms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;


--
-- Name: gallery_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_media (
    id integer NOT NULL,
    type character varying(10) NOT NULL,
    title text,
    file_path text NOT NULL,
    thumbnail_path text,
    duration_seconds integer,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    text text,
    subtext text,
    CONSTRAINT gallery_media_type_check CHECK (((type)::text = ANY ((ARRAY['IMAGE'::character varying, 'VIDEO'::character varying])::text[])))
);


--
-- Name: gallery_media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gallery_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gallery_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gallery_media_id_seq OWNED BY public.gallery_media.id;


--
-- Name: gazette_notices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gazette_notices (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: gazette_notices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gazette_notices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gazette_notices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gazette_notices_id_seq OWNED BY public.gazette_notices.id;


--
-- Name: gazette_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gazette_resources (
    id integer NOT NULL,
    notice_id integer,
    type text NOT NULL,
    filename text NOT NULL,
    original_name text NOT NULL,
    url text NOT NULL,
    display_order integer DEFAULT 0,
    CONSTRAINT gazette_resources_type_check CHECK ((type = ANY (ARRAY['image'::text, 'document'::text])))
);


--
-- Name: gazette_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gazette_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gazette_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gazette_resources_id_seq OWNED BY public.gazette_resources.id;


--
-- Name: land_registries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.land_registries (
    id integer NOT NULL,
    serial_no integer NOT NULL,
    county text NOT NULL,
    station text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: land_registries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.land_registries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: land_registries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.land_registries_id_seq OWNED BY public.land_registries.id;


--
-- Name: land_registries_serial_no_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.land_registries ALTER COLUMN serial_no ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.land_registries_serial_no_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_files (
    id bigint NOT NULL,
    media_item_id bigint,
    file_path text NOT NULL,
    type text NOT NULL,
    "order" integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT media_files_type_check CHECK ((type = ANY (ARRAY['image'::text, 'video'::text])))
);


--
-- Name: media_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_files_id_seq OWNED BY public.media_files.id;


--
-- Name: media_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_items (
    id bigint NOT NULL,
    title text NOT NULL,
    subtitle text,
    slug text NOT NULL,
    story text NOT NULL,
    date date NOT NULL,
    preview_image text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: media_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_items_id_seq OWNED BY public.media_items.id;


--
-- Name: registry_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registry_locations (
    id integer NOT NULL,
    registry_id integer,
    location text NOT NULL,
    departments text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: registry_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registry_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: registry_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registry_locations_id_seq OWNED BY public.registry_locations.id;


--
-- Name: resource_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_sections (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: resource_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resource_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resource_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resource_sections_id_seq OWNED BY public.resource_sections.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    section_id integer,
    title text NOT NULL,
    slug text NOT NULL,
    pdf_filename text,
    fallback_content text DEFAULT 'No media uploaded for this resource.'::text,
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: service_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_items (
    id integer NOT NULL,
    category_id integer NOT NULL,
    number integer NOT NULL,
    title character varying(500) NOT NULL,
    slug character varying(500) NOT NULL,
    description text,
    requirements jsonb DEFAULT '[]'::jsonb,
    timeline character varying(255),
    fee character varying(255),
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: service_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_items_id_seq OWNED BY public.service_items.id;


--
-- Name: tenders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenders (
    id integer NOT NULL,
    tender_no text NOT NULL,
    description text NOT NULL,
    start_date date NOT NULL,
    closing_datetime timestamp with time zone NOT NULL,
    document_path text,
    document_size bigint,
    document_name text,
    document_mime_type text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT tenders_start_date_check CHECK ((start_date >= CURRENT_DATE))
);


--
-- Name: tenders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tenders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tenders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tenders_id_seq OWNED BY public.tenders.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: forms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);


--
-- Name: gallery_media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_media ALTER COLUMN id SET DEFAULT nextval('public.gallery_media_id_seq'::regclass);


--
-- Name: gazette_notices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gazette_notices ALTER COLUMN id SET DEFAULT nextval('public.gazette_notices_id_seq'::regclass);


--
-- Name: gazette_resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gazette_resources ALTER COLUMN id SET DEFAULT nextval('public.gazette_resources_id_seq'::regclass);


--
-- Name: land_registries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.land_registries ALTER COLUMN id SET DEFAULT nextval('public.land_registries_id_seq'::regclass);


--
-- Name: media_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files ALTER COLUMN id SET DEFAULT nextval('public.media_files_id_seq'::regclass);


--
-- Name: media_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_items ALTER COLUMN id SET DEFAULT nextval('public.media_items_id_seq'::regclass);


--
-- Name: registry_locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registry_locations ALTER COLUMN id SET DEFAULT nextval('public.registry_locations_id_seq'::regclass);


--
-- Name: resource_sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_sections ALTER COLUMN id SET DEFAULT nextval('public.resource_sections_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: service_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_items ALTER COLUMN id SET DEFAULT nextval('public.service_items_id_seq'::regclass);


--
-- Name: tenders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders ALTER COLUMN id SET DEFAULT nextval('public.tenders_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, title, slug, created_at) FROM stdin;
15	Registration of Deeds/Contracts/Bonds	registration-of-deeds-contracts-bonds	2025-12-04 04:04:54.086209
16	Valuation Services	valuation-services	2025-12-04 05:00:59.721306
17	Land Administration Services	land-administration-services	2025-12-04 05:14:06.324888
18	Land Adjudication and Settlement Services	land-adjudication-and-settlement-services	2025-12-04 05:20:50.98372
19	Physical Planning Services	physical-planning-services	2025-12-04 05:24:56.527131
20	Surveys and Mapping Services	surveys-and-mapping-services	2025-12-04 05:31:53.730389
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faqs (id, question, answer, created_at, updated_at) FROM stdin;
3	How will I know the commencement date of transactions in the new register?	  The date is captured in the Gazette Notice No. 11348 of December 31, 2020. It is also indicated in an advert appearing in the MyGov pullout of The Star of 12th January, 2021. This is in respect of parcels within Nairobi City County. The Ministry aims to complete the migration process in the entire Country by December, 2022.	2025-12-09 02:16:25.103849-05	2025-12-09 02:16:25.103849-05
1	What is Conversion?   jjjjj	Conversion is the process of migrating all parcels from the repealed land registration statutes to a unitary regime under the Land Registration Act, 2012.	2025-12-09 02:10:39.079142-05	2025-12-09 02:26:32.694542-05
4	what question again?	i don't know, ask trump	2025-12-09 02:29:16.268551-05	2025-12-09 02:29:16.268551-05
5	ask who again?	ask trump	2025-12-09 02:29:34.591939-05	2025-12-09 02:29:34.591939-05
2	What is the process of Conversion? mmm	It entails the following: (i) Preparation of cadastral maps together with a conversion list, (ii) Publication of the cadastral maps together with a conversion list, (iii) Lodgment and consideration of complaints, (iv) Closure of old registers and commencement of transactions in the new register (v) Application for replacement of title documents from the old registers.	2025-12-09 02:12:57.867982-05	2025-12-09 02:58:31.526569-05
9	kkk	lll	2025-12-09 03:08:40.405615-05	2025-12-09 03:08:40.405615-05
10	mmmmmmm	vvvvvvvv	2025-12-09 03:08:45.442368-05	2025-12-09 03:08:45.442368-05
11	ssssss	aaaaaaa	2025-12-09 03:08:50.433343-05	2025-12-09 03:08:50.433343-05
12	qqqqqqqqqq	wwwwww	2025-12-09 03:08:55.580236-05	2025-12-09 03:08:55.580236-05
\.


--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms (id, sno, form_number, description, category, pdf_filename, pdf_size_kb, created_at, updated_at) FROM stdin;
1	1	FORM CLA-1	Application for Recognition of Interest/ Claim on Community Land	CLA forms	FORM-CLA-1.pdf	52.86	2025-12-05 01:13:54.100119-05	2025-12-05 01:13:54.100119-05
3	1	FORM CLA-22	Application for Recognition of Interest/ Claim on Community Land	CLA forms	FORM-CLA-22.pdf	340.81	2025-12-05 01:21:40.22724-05	2025-12-05 02:21:53.185142-05
5	12	FORM-CLA-78	kMMMM	CLA Forms	\N	\N	2025-12-05 02:32:51.139485-05	2025-12-05 02:32:51.139485-05
\.


--
-- Data for Name: gallery_media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gallery_media (id, type, title, file_path, thumbnail_path, duration_seconds, "order", created_at, updated_at, text, subtext) FROM stdin;
23	IMAGE	250537	/uploads/gallery/9c414720-450c-4779-a816-afea90da2e2a-250537.jpg	/uploads/gallery/thumbs/thumb-c6e3b2e8-1428-44dc-b616-5864d19ba127.jpg	\N	0	2025-12-06 02:50:09.920941-05	2025-12-06 02:50:09.920941-05	Hon. Alice Wahome, E.G.H.	Cabinet Secretary, Ministry of Lands, Public Works, Housing and Urban Development
24	IMAGE	250545	/uploads/gallery/3d87f997-2afd-4b79-9b8a-47bed654fed1-250545.jpg	/uploads/gallery/thumbs/thumb-30008dc2-606e-4ba6-9c88-0dcf32944232.jpg	\N	1	2025-12-06 02:50:10.134067-05	2025-12-06 02:50:10.134067-05	Hon. Alice Wahome, E.G.H.	Cabinet Secretary, Ministry of Lands, Public Works, Housing and Urban Development
25	IMAGE	250555	/uploads/gallery/4faf9ff4-b3f6-4de6-a0ca-e91333d9e091-250555.jpg	/uploads/gallery/thumbs/thumb-b074c2ce-c292-4152-8464-efd17bdaa9c2.jpg	\N	2	2025-12-06 02:50:10.26226-05	2025-12-06 02:50:10.26226-05	Hon. Alice Wahome, E.G.H.	Cabinet Secretary, Ministry of Lands, Public Works, Housing and Urban Development
26	VIDEO	306155_medium	/uploads/gallery/8c19d1db-6d4f-4da8-9cae-2c32e778333d-306155_medium.mp4	\N	\N	3	2025-12-06 02:50:10.280318-05	2025-12-06 02:50:10.280318-05	Hon. Alice Wahome, E.G.H.	Cabinet Secretary, Ministry of Lands, Public Works, Housing and Urban Development
27	VIDEO	307864_tiny	/uploads/gallery/9e4377e3-2802-4ecc-b2dc-29ae288b5382-307864_tiny.mp4	\N	\N	4	2025-12-06 02:50:10.286755-05	2025-12-06 02:50:10.286755-05	Hon. Alice Wahome, E.G.H.	Cabinet Secretary, Ministry of Lands, Public Works, Housing and Urban Development
28	VIDEO	289855_tiny	/uploads/gallery/b18a770e-3a34-408a-8fb3-c29aea2e30e5-289855_tiny.mp4	\N	\N	5	2025-12-06 04:38:34.830032-05	2025-12-06 04:38:34.830032-05	Hon. Generali Nixon Korir, C.B.S.	PS - State Department for Lands and Physical Planning
29	VIDEO	298103_small	/uploads/gallery/d69063de-b618-4ddf-add0-f7687d8139ab-298103_small.mp4	\N	\N	6	2025-12-06 04:38:34.841106-05	2025-12-06 04:38:34.841106-05	Hon. Generali Nixon Korir, C.B.S.	PS - State Department for Lands and Physical Planning
30	IMAGE	1302472	/uploads/gallery/e5fe9585-92a1-49bc-8355-def8fb35b7d7-1302472.jpg	/uploads/gallery/thumbs/thumb-5e7a94bf-0523-4c8d-8c6d-551d599904b6.jpg	\N	7	2025-12-06 04:38:34.900807-05	2025-12-06 04:38:34.900807-05	Hon. Generali Nixon Korir, C.B.S.	PS - State Department for Lands and Physical Planning
31	IMAGE	1302475	/uploads/gallery/35ecc3a6-7c70-43cc-8c83-8c6b06a8cef5-1302475.jpg	/uploads/gallery/thumbs/thumb-b561bb35-d7ef-432d-820d-e7abddc96d30.jpg	\N	8	2025-12-06 04:38:34.938444-05	2025-12-06 04:38:34.938444-05	Hon. Generali Nixon Korir, C.B.S.	PS - State Department for Lands and Physical Planning
32	IMAGE	1302476	/uploads/gallery/116794f3-cdb6-4a29-a826-ae9b980b6fce-1302476.jpg	/uploads/gallery/thumbs/thumb-cb06d0c2-2366-4139-88f0-61df31ab218b.jpg	\N	9	2025-12-06 04:38:35.048659-05	2025-12-06 04:38:35.048659-05	Hon. Generali Nixon Korir, C.B.S.	PS - State Department for Lands and Physical Planning
33	IMAGE	cute-9351912_1920	/uploads/gallery/42253038-0907-4426-a23c-8a38e2b2ea29-cute-9351912_1920.jpg	/uploads/gallery/thumbs/thumb-c649e5d8-b06b-474d-87a8-3b5b79876a6b.jpg	\N	10	2025-12-06 04:56:35.300958-05	2025-12-06 04:56:35.300958-05	Mohammed A. Maalim M.B.S., ndc (K)	Secretary Administration
34	VIDEO	istockphoto-2002908406-640_adpp_is	/uploads/gallery/53ec8f9a-f0a1-4258-bc5d-d10994e718d9-istockphoto-2002908406-640_adpp_is.mp4	\N	\N	11	2025-12-06 04:56:35.317065-05	2025-12-06 04:56:35.317065-05	Mohammed A. Maalim M.B.S., ndc (K)	Secretary Administration
35	IMAGE	landscape-9947733_1920	/uploads/gallery/edde9550-8c5a-4e7e-be04-25dc2f253d7b-landscape-9947733_1920.jpg	/uploads/gallery/thumbs/thumb-6510359f-bdbd-4cc1-a774-96cbc5264491.jpg	\N	12	2025-12-06 04:56:35.401588-05	2025-12-06 04:56:35.401588-05	Mohammed A. Maalim M.B.S., ndc (K)	Secretary Administration
36	VIDEO	matrix-rain-codes.1920x1080	/uploads/gallery/ecf6f703-25e3-43df-a289-0bf268abfead-matrix-rain-codes.1920x1080.mp4	\N	\N	13	2025-12-06 04:56:35.476573-05	2025-12-06 04:56:35.476573-05	Mohammed A. Maalim M.B.S., ndc (K)	Secretary Administration
37	VIDEO	matrix-raining-particles.1920x1080	/uploads/gallery/85f3dfc5-bfd1-43bd-bded-2886225f9c25-matrix-raining-particles.1920x1080.mp4	\N	\N	14	2025-12-06 04:56:35.550148-05	2025-12-06 04:56:35.550148-05	Mohammed A. Maalim M.B.S., ndc (K)	Secretary Administration
38	VIDEO	matrix-raining-particles.3840x2160	/uploads/gallery/ee4f3164-3941-4e1a-b9bf-b020321240f1-matrix-raining-particles.3840x2160.mp4	\N	\N	15	2025-12-06 04:58:13.752876-05	2025-12-06 04:58:13.752876-05	Sarah Maina	Land Secretary
39	IMAGE	mountain-cabin-9776289	/uploads/gallery/699ddaa9-68a6-4cb1-abe3-93df577f0b24-mountain-cabin-9776289.jpg	/uploads/gallery/thumbs/thumb-f41822ef-586d-463a-9c5a-88c114ea9e07.jpg	\N	16	2025-12-06 04:58:13.881183-05	2025-12-06 04:58:13.881183-05	Sarah Maina	Land Secretary
40	IMAGE	Screenshot_2025-10-14_08_22_19	/uploads/gallery/63856f51-f5c9-4136-bd33-b7c98a976b1e-Screenshot_2025-10-14_08_22_19.png	/uploads/gallery/thumbs/thumb-e029ddae-ff2b-41c1-9a63-237be2a38ba4.jpg	\N	17	2025-12-06 04:58:13.913183-05	2025-12-06 04:58:13.913183-05	Sarah Maina	Land Secretary
41	IMAGE	4	/uploads/gallery/9677fc9c-ba0b-479d-af40-489d898fbf95-4.jpg	/uploads/gallery/thumbs/thumb-a7f32e8c-cc66-4d0c-9905-066a52578eeb.jpg	\N	18	2025-12-06 04:59:55.577557-05	2025-12-06 04:59:55.577557-05	Monica Obongo	Director NLIMS
42	IMAGE	150328	/uploads/gallery/feb526c4-db52-4a1b-8554-04c767fbd1df-150328.jpg	/uploads/gallery/thumbs/thumb-d6c8cf90-1e84-4586-bf26-7896a7355a07.jpg	\N	19	2025-12-06 04:59:55.678239-05	2025-12-06 04:59:55.678239-05	Monica Obongo	Director NLIMS
43	VIDEO	152085-802335503_tiny	/uploads/gallery/450de622-dead-43c2-98a3-05e6e9093563-152085-802335503_tiny.mp4	\N	\N	20	2025-12-06 04:59:55.687819-05	2025-12-06 04:59:55.687819-05	Monica Obongo	Director NLIMS
44	VIDEO	307864_tiny	/uploads/gallery/447fd79c-1768-44b3-bd1b-3898d68c669e-307864_tiny.mp4	\N	\N	21	2025-12-06 05:01:29.077434-05	2025-12-06 05:01:29.077434-05	David Nyandoro	Chief Land Registrar
45	VIDEO	308073_small	/uploads/gallery/50fc4dfb-1675-423a-a853-0f3be760821f-308073_small.mp4	\N	\N	22	2025-12-06 05:01:29.228456-05	2025-12-06 05:01:29.228456-05	David Nyandoro	Chief Land Registrar
46	IMAGE	1302478	/uploads/gallery/5e3c0600-a4a6-4259-a3f2-56d680814f9f-1302478.jpg	/uploads/gallery/thumbs/thumb-4fab9bb9-c6cf-4db9-bca9-b635cc68a923.jpg	\N	23	2025-12-06 05:01:29.619014-05	2025-12-06 05:01:29.619014-05	David Nyandoro	Chief Land Registrar
47	IMAGE	1302488	/uploads/gallery/0dfd9453-fd88-43c2-ad95-e8fa35ff83f9-1302488.jpg	/uploads/gallery/thumbs/thumb-550c6c96-be0c-4cc5-8d56-6ce33bac5882.jpg	\N	24	2025-12-06 05:01:29.702911-05	2025-12-06 05:01:29.702911-05	David Nyandoro	Chief Land Registrar
48	VIDEO	289855_tiny	/uploads/gallery/9186f542-499a-4045-aba5-b50877ebbb93-289855_tiny.mp4	\N	\N	25	2025-12-06 05:03:37.709296-05	2025-12-06 05:03:37.709296-05	Kennedy Njenga	Director Land Adjudication and Settlement
49	VIDEO	304330_small	/uploads/gallery/413424be-8f0d-4f40-8d89-1804c5f0df73-304330_small.mp4	\N	\N	26	2025-12-06 05:03:37.716239-05	2025-12-06 05:03:37.716239-05	Kennedy Njenga	Director Land Adjudication and Settlement
50	IMAGE	nature-9710930	/uploads/gallery/f79ff853-86c9-4e15-8d92-6b2cb0b8908e-nature-9710930.jpg	/uploads/gallery/thumbs/thumb-6771ae5f-3a93-4ea8-b2e1-da09587ee7a6.jpg	\N	27	2025-12-06 05:03:37.80236-05	2025-12-06 05:03:37.80236-05	Kennedy Njenga	Director Land Adjudication and Settlement
51	IMAGE	1988042	/uploads/gallery/f90ed0b9-3aeb-40a7-93cc-5644cb5d3d3d-1988042.jpg	/uploads/gallery/thumbs/thumb-0f793a05-7509-49d4-95fc-0cc463e5d12b.jpg	\N	28	2025-12-06 05:05:16.002573-05	2025-12-06 05:05:16.002573-05	Weldon Maritim	Director Surveys
52	IMAGE	1988110	/uploads/gallery/53242556-9785-47a8-8b31-7718b18cf8ec-1988110.jpg	/uploads/gallery/thumbs/thumb-711717e6-19dd-42e4-bf79-6e43cc51dfd0.jpg	\N	29	2025-12-06 05:05:16.099856-05	2025-12-06 05:05:16.099856-05	Weldon Maritim	Director Surveys
53	IMAGE	2078092	/uploads/gallery/076fa226-d6bd-4534-b071-4f5c5304b807-2078092.jpg	/uploads/gallery/thumbs/thumb-a8d087d6-3f3a-461d-91bf-65007e47db0c.jpg	\N	30	2025-12-06 05:05:16.419075-05	2025-12-06 05:05:16.419075-05	Weldon Maritim	Director Surveys
54	IMAGE	2078108	/uploads/gallery/a4d3a78b-46be-420b-a8bb-2ed96e6e6ac8-2078108.jpg	/uploads/gallery/thumbs/thumb-8ea61e96-cebe-42a0-87d7-61107545ec58.jpg	\N	31	2025-12-06 05:05:16.468392-05	2025-12-06 05:05:16.468392-05	Weldon Maritim	Director Surveys
55	VIDEO	matrix-rain-codes.1920x1080	/uploads/gallery/f8e533c3-f5dc-40fc-906f-17d981856778-matrix-rain-codes.1920x1080.mp4	\N	\N	32	2025-12-06 05:05:16.527903-05	2025-12-06 05:05:16.527903-05	Weldon Maritim	Director Surveys
56	VIDEO	matrix-raining-particles.1920x1080	/uploads/gallery/8fcfb00f-057b-4bf0-be7b-b03f47a92953-matrix-raining-particles.1920x1080.mp4	\N	\N	33	2025-12-06 05:05:16.640601-05	2025-12-06 05:05:16.640601-05	Weldon Maritim	Director Surveys
57	VIDEO	istockphoto-2002908406-640_adpp_is	/uploads/gallery/136988a3-4e50-4c8d-af33-a2b7312b7b3e-istockphoto-2002908406-640_adpp_is.mp4	\N	\N	34	2025-12-06 05:07:34.996329-05	2025-12-06 05:07:34.996329-05	Gordon Ochieng’	Director, Land Administration
58	IMAGE	kingfisher-9174586	/uploads/gallery/bfa2794c-7ecb-4207-9db8-79838b5dab1f-kingfisher-9174586.jpg	/uploads/gallery/thumbs/thumb-3a49bcf3-9e91-4b9e-bc2f-cc9d4592f888.jpg	\N	35	2025-12-06 05:07:35.091341-05	2025-12-06 05:07:35.091341-05	Gordon Ochieng’	Director, Land Administration
\.


--
-- Data for Name: gazette_notices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gazette_notices (id, slug, title, content, created_at, updated_at) FROM stdin;
2	pdp-ref-no-23900004444444	PDP Ref.NO 23900004444444	<p>PURSUANT to regulation 4 (4) of the Land Registration&nbsp;(Registration Units) Order, 2017, the Cabinet Secretary for Lands and&nbsp;Physical Planning, having received from the Registrar conversion list&nbsp;and cadastral maps in respect of Nairobi Land Registration Unit,&nbsp;hereby notifies the general public that land reference numbers&nbsp;specified in the first column of the Schedule have been converted to&nbsp;new parcel numbers, specified in the second column thereof, with&nbsp;corresponding area respectively specified in the third column.</p><p></p><p style="text-align: justify;">Any person with an interest in land within the registration unit who&nbsp;is aggrieved by the information in the conversion list or the cadastral&nbsp;maps is invited, within the next ninety (90) days from the date of&nbsp;publication of this notice to -</p><p style="text-align: justify;"></p><p style="text-align: justify;">Any person with an interest in land within the registration unit who&nbsp;is aggrieved by the information in the conversion list or the cadastral&nbsp;maps is invited, within the next ninety (90) days from the date of&nbsp;publication of this notice to -</p><p style="text-align: justify;"></p><p><strong>[a]</strong>&nbsp;make a complaint, in writing in <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline" href="https://lands.go.ke/lands/sites/default/files/2025-06/Form-LRA-96-PRESENTATION-ON-OBJECTIONS-TO-THE-CONVERSION-LIST.docx">Form LRA 96</a> set out in the Second Schedule to the Land Registration (Registration Units) Order, 2017, to the Registrar in respect of the information contained in the conversion list and the cadastral maps; or&nbsp;</p><p></p><p><strong>[b]</strong> apply to the Registrar in <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline" href="https://lands.go.ke/lands/sites/default/files/2025-06/Form-LRA-67-CAUTION.docx">Form LRA 67</a> set out in the Sixth&nbsp;Schedule to the Land Registration (General) Regulations, 2017,&nbsp;for the registration of a caution pending the clarification&nbsp;or resolution of any complaint.</p><p></p><p>The conversion lists and cadastral maps can also be accessed&nbsp;from -</p><p></p><p><strong>[i]</strong> Ministry of Lands and Physical Planning, Ardhi House, 1st Ngong Avenue, Nairobi</p><p><strong>[ii]</strong> Department of Surveys (Survey of Kenya), Ruaraka</p><p></p><p>All transactions or dealings relating to parcels affected by the&nbsp;notice shall from the 9th August, 2024 be carried out in the new&nbsp;registers.</p>	2025-12-09 07:07:23.167904-05	2025-12-09 07:07:23.167904-05
3	pdp-ref-3434-343	PDP Ref 3434-343	<p>PURSUANT to regulation 4 (4) of the Land Registration&nbsp;(Registration Units) Order, 2017, the Cabinet Secretary for Lands and&nbsp;Physical Planning, having received from the Registrar conversion list&nbsp;and cadastral maps in respect of Nairobi Land Registration Unit,&nbsp;hereby notifies the general public that land reference numbers&nbsp;specified in the first column of the Schedule have been converted to&nbsp;new parcel numbers, specified in the second column thereof, with&nbsp;corresponding area respectively specified in the third column.</p><p></p><p style="text-align: justify;">Any person with an interest in land within the registration unit who&nbsp;is aggrieved by the information in the conversion list or the cadastral&nbsp;maps is invited, within the next ninety (90) days from the date of&nbsp;publication of this notice to -</p><p style="text-align: justify;"></p><p style="text-align: justify;">Any person with an interest in land within the registration unit who&nbsp;is aggrieved by the information in the conversion list or the cadastral&nbsp;maps is invited, within the next ninety (90) days from the date of&nbsp;publication of this notice to -</p><p style="text-align: justify;"></p><p><strong>[a]</strong>&nbsp;make a complaint, in writing in <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline" href="https://lands.go.ke/lands/sites/default/files/2025-06/Form-LRA-96-PRESENTATION-ON-OBJECTIONS-TO-THE-CONVERSION-LIST.docx">Form LRA 96</a> set out in the Second Schedule to the Land Registration (Registration Units) Order, 2017, to the Registrar in respect of the information contained in the conversion list and the cadastral maps; or&nbsp;</p><p></p><p><strong>[b]</strong> apply to the Registrar in <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline" href="https://lands.go.ke/lands/sites/default/files/2025-06/Form-LRA-67-CAUTION.docx">Form LRA 67</a> set out in the Sixth&nbsp;Schedule to the Land Registration (General) Regulations, 2017,&nbsp;for the registration of a caution pending the clarification&nbsp;or resolution of any complaint.</p><p></p><p>The conversion lists and cadastral maps can also be accessed&nbsp;from -</p><p></p><p><strong>[i]</strong> Ministry of Lands and Physical Planning, Ardhi House, 1st Ngong Avenue, Nairobi</p><p><strong>[ii]</strong> Department of Surveys (Survey of Kenya), Ruaraka</p><p></p><p>All transactions or dealings relating to parcels affected by the&nbsp;notice shall from the 9th August, 2024 be carried out in the new&nbsp;registers.</p>	2025-12-09 07:08:21.393182-05	2025-12-09 07:08:21.393182-05
\.


--
-- Data for Name: gazette_resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gazette_resources (id, notice_id, type, filename, original_name, url, display_order) FROM stdin;
2	2	document	1765282035265-airdecap-ng__Aircrack-ng_-3.pdf	airdecap-ng [Aircrack-ng]-3.pdf	/uploads/gazette-notices/1765282035265-airdecap-ng__Aircrack-ng_-3.pdf	0
3	2	image	1765282038273-backiee-116893-landscape.jpg	backiee-116893-landscape.jpg	/uploads/gazette-notices/1765282038273-backiee-116893-landscape.jpg	1
4	2	document	1765282041906-Digital_Forensics-notes.pdf	Digital Forensics-notes.pdf	/uploads/gazette-notices/1765282041906-Digital_Forensics-notes.pdf	2
5	3	image	1765282086232-barley-4423698_1920.jpg	barley-4423698_1920.jpg	/uploads/gazette-notices/1765282086232-barley-4423698_1920.jpg	0
6	3	document	1765282090416-airdecap-ng__Aircrack-ng_-3.pdf	airdecap-ng [Aircrack-ng]-3.pdf	/uploads/gazette-notices/1765282090416-airdecap-ng__Aircrack-ng_-3.pdf	1
7	3	image	1765282093555-2078204.jpg	2078204.jpg	/uploads/gazette-notices/1765282093555-2078204.jpg	2
8	3	document	1765282098673-Letter_Request_for_Buni_API_System_Integration.docx	Letter Request for Buni API System Integration.docx	/uploads/gazette-notices/1765282098673-Letter_Request_for_Buni_API_System_Integration.docx	3
\.


--
-- Data for Name: land_registries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.land_registries (id, serial_no, county, station, created_at, updated_at) FROM stdin;
2	2	Kwale	Kwale	2025-12-07 05:05:27.995052-05	2025-12-07 05:06:01.486042-05
\.


--
-- Data for Name: media_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media_files (id, media_item_id, file_path, type, "order", created_at) FROM stdin;
1	8	/media/8/7afd88d5-e642-4439-a3e5-0405814c9985.png	image	0	2025-12-03 08:20:43.24058-05
2	8	/media/8/e912c6d3-dbcd-472a-99a6-bc9a0f1a4983.png	image	1	2025-12-03 08:20:43.24181-05
3	8	/media/8/82564f39-cd2d-40ef-a36e-dd5f4b948180.jpeg	image	2	2025-12-03 08:20:43.242747-05
4	9	/media/9/58f25ef7-0ac6-40b9-b165-c26ca2e6b538.jpg	image	0	2025-12-03 08:47:13.966827-05
5	9	/media/9/1579e7ae-39ac-4e58-b046-d5d99206980b.jpg	image	1	2025-12-03 08:47:13.972659-05
6	9	/media/9/9b87e390-911b-48b9-84c4-7036a051c8e3.mp4	video	2	2025-12-03 08:47:13.994418-05
7	9	/media/9/44999987-7ec3-4e1c-8ad4-4b875060a362.mp4	video	3	2025-12-03 08:47:14.040399-05
\.


--
-- Data for Name: media_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media_items (id, title, subtitle, slug, story, date, preview_image, created_at, updated_at) FROM stdin;
8	ppppp	77777	ppppp	oooop\r\n\r\nopopo\r\n\r\nllkl	2025-12-02	/media/8/preview.png	2025-12-03 08:20:43.199841-05	2025-12-03 08:20:43.199841-05
9	kkkkkkkkkk	\N	kkkkkkkkkk	aaaaaaaaaaaa\r\nffffffffffffffff\r\nddddddddddd\r\naaaaaaaaaaa\r\nssssssss	2025-12-01	/media/9/preview.jpg	2025-12-03 08:47:13.945067-05	2025-12-03 08:47:13.945067-05
\.


--
-- Data for Name: registry_locations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.registry_locations (id, registry_id, location, departments, created_at) FROM stdin;
4	\N	Uhuru na Kazi  Building,1st Flr  P.O Box 80053-80100,  Mombasa.	  Building,1st Flr  P.O Box 80053-80100,  Mombasa. \t  Land Registration,  Land Administration,  Land Valuation 	2025-12-07 04:57:31.713475-05
5	\N	Bima Tower 10th &  11th Floors, Digo Road.  P.O Box 81620-8010O,  Mombasa.	Land Adjudication & Settlement	2025-12-07 04:57:31.713475-05
6	\N	Bima Tower 10th &  11th Floors, Digo Road.  P.O Box, 80095- 80100,  Mombasa.	Land Survey& Mappingg	2025-12-07 04:57:31.713475-05
8	2	Kwale Lands Registry  P.O Box 23-80403/ P.O. Box 23-80403,  Kwale.  Physical Location: Former County Assembly offices next to Kwale Police HQ	Land Registration,  Land Adjudication & Settlement,  Land Administration,  Land Valuation,  Land Survey& Mapping	2025-12-07 05:06:01.486042-05
9	2	Kinango offices are located at Kinango township.  P.O. Box 38-80405,   Kwale.	Land Adjudication & Settlement,  Land Survey& Mapping	2025-12-07 05:06:01.486042-05
\.


--
-- Data for Name: resource_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_sections (id, title, slug, "order", created_at) FROM stdin;
1	Gazette Notices	gazette-notices	10	2025-12-04 06:33:26.690149-05
2	Service Charter	service-charter	20	2025-12-04 06:33:26.690149-05
3	Central Planning and Project Monitoring (CPPMD)	cppmd	30	2025-12-04 06:33:26.690149-05
4	Community Land	community-land	40	2025-12-04 06:33:26.690149-05
5	Ease of Doing Business	ease-of-doing-business	50	2025-12-04 06:33:26.690149-05
6	Kenya Digital Economy Blueprint	digital-economy-blueprint	60	2025-12-04 06:33:26.690149-05
7	Physical Planning	physical-planning	70	2025-12-04 06:33:26.690149-05
8	Approved Regulations for the Physical and Land Use Planning Act	approved-regulations	80	2025-12-04 06:33:26.690149-05
9	User Guides	user-guides	90	2025-12-04 06:33:26.690149-05
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resources (id, section_id, title, slug, pdf_filename, fallback_content, "order", created_at, updated_at) FROM stdin;
1	1	The Land (Amendment) Act 2025	the-land-amendment-act-2025	the-land-amendment-act-2025.pdf	Coming Soon...	0	2025-12-04 07:23:37.630808-05	2025-12-04 07:23:37.630808-05
3	2	Kiswahili Service Charter	kiswahili-service-charter	kiswahili-service-charter.pdf	No media uploaded for this resource.	0	2025-12-04 07:27:02.846748-05	2025-12-04 07:27:02.846748-05
4	2	Sign Language/ Audio Service Charter (English Edition)	sign-language-audio-service-charter-english-edition	sign-language-audio-service-charter-english-edition.pdf	No media uploaded for this resource.	0	2025-12-04 07:27:25.418579-05	2025-12-04 07:27:25.418579-05
5	4	Most Frequently Asked Questions on Community Land Act	most-frequently-asked-questions-on-community-land-act	\N	No media uploaded for this resource.	0	2025-12-04 07:28:57.5946-05	2025-12-04 07:28:57.5946-05
6	4	Strategic Plan 2023 -2027, State Department for Lands and Physical Planning	strategic-plan-2023-2027-state-department-for-lands-and-physical-planning	strategic-plan-2023-2027-state-department-for-lands-and-physical-planning.pdf	No media uploaded for this resource.	0	2025-12-04 07:43:39.172286-05	2025-12-04 07:43:39.172286-05
7	3	Performance Contract 2024/25 - Ministry of Lands, Public Works, Housing and Urban Development	performance-contract-2024-25-ministry-of-lands-public-works-housing-and-urban-development	performance-contract-2024-25-ministry-of-lands-public-works-housing-and-urban-development.pdf	No media uploaded for this resource.	0	2025-12-04 07:44:20.150818-05	2025-12-04 07:44:20.150818-05
8	3	Strategic Plan 2023 -2027, State Department for Lands and Physical Planning	strategic-plan-2023-2027-state-department-for-lands-and-physical-planning	strategic-plan-2023-2027-state-department-for-lands-and-physical-planning.pdf	No media uploaded for this resource.	0	2025-12-04 07:44:37.183471-05	2025-12-04 07:44:37.183471-05
9	6	Kenya Digital Economy Blueprint	kenya-digital-economy-blueprint	\N	No media uploaded for this resource.	0	2025-12-04 07:46:07.207087-05	2025-12-04 07:46:07.207087-05
10	9	Professional Account Upgrade	professional-account-upgrade	professional-account-upgrade.pdf	No media uploaded for this resource.	0	2025-12-04 07:48:01.92791-05	2025-12-04 07:48:01.92791-05
11	9	Arbitration User guide	arbitration-user-guide	arbitration-user-guide.pdf	No media uploaded for this resource.	0	2025-12-04 07:48:22.005272-05	2025-12-04 07:48:22.005272-05
12	9	Asset Valuation User Guide	asset-valuation-user-guide	asset-valuation-user-guide.pdf	No media uploaded for this resource.	0	2025-12-04 07:48:36.597161-05	2025-12-04 07:48:36.597161-05
13	9	Compliance Certificate	compliance-certificate	compliance-certificate.pdf	No media uploaded for this resource.	0	2025-12-04 07:48:54.029065-05	2025-12-04 07:48:54.029065-05
14	9	Customer care User guide	customer-care-user-guide	customer-care-user-guide.pdf	No media uploaded for this resource.	0	2025-12-04 07:49:10.372852-05	2025-12-04 07:49:10.372852-05
15	9	Estate Administration	estate-administration	estate-administration.pdf	No media uploaded for this resource.	0	2025-12-04 07:49:29.494098-05	2025-12-04 07:49:29.494098-05
16	9	Government Leasing User guide	government-leasing-user-guide	government-leasing-user-guide.pdf	No media uploaded for this resource.	0	2025-12-04 07:49:45.275917-05	2025-12-04 07:49:45.275917-05
17	9	Land rent Payment User Guide	land-rent-payment-user-guide	land-rent-payment-user-guide.pdf	No media uploaded for this resource.	0	2025-12-04 07:50:08.611382-05	2025-12-04 07:50:08.611382-05
18	9	Plan Requisition	plan-requisition	plan-requisition.pdf	No media uploaded for this resource.	0	2025-12-04 07:50:37.860718-05	2025-12-04 07:50:37.860718-05
19	9	Resurvey Public Facing User	resurvey-public-facing-user	resurvey-public-facing-user.pdf	No media uploaded for this resource.	0	2025-12-04 07:50:55.252397-05	2025-12-04 07:50:55.252397-05
20	9	Sale of Plan User guide	sale-of-plan-user-guide	sale-of-plan-user-guide.pdf	No media uploaded for this resource.	0	2025-12-04 07:51:11.005884-05	2025-12-04 07:51:11.005884-05
21	9	Search User guide	search-user-guide	search-user-guide.pdf	No media uploaded for this resource.	0	2025-12-04 07:51:25.53027-05	2025-12-04 07:51:25.53027-05
22	9	Transfer of Interest in Land	transfer-of-interest-in-land	transfer-of-interest-in-land.pdf	No media uploaded for this resource.	0	2025-12-04 07:51:38.475095-05	2025-12-04 07:51:38.475095-05
23	9	User Guide - Physical Planning	user-guide-physical-planning	user-guide-physical-planning.pdf	No media uploaded for this resource.	0	2025-12-04 07:51:55.286691-05	2025-12-04 07:51:55.286691-05
24	5	Land Reforms on Ease of Doing Business	land-reforms-on-ease-of-doing-business	\N	No media uploaded for this resource.	0	2025-12-04 07:53:00.207743-05	2025-12-04 07:53:00.207743-05
25	6	Summary of Land Transactions in Nairobi in 2022	summary-of-land-transactions-in-nairobi-in-2022	\N	No media uploaded for this resource.	0	2025-12-04 07:53:23.67862-05	2025-12-04 07:53:23.67862-05
26	6	Summary of Land Transactions in Nairobi in 2021	summary-of-land-transactions-in-nairobi-in-2021	\N	No media uploaded for this resource.	0	2025-12-04 07:53:36.097923-05	2025-12-04 07:53:36.097923-05
27	6	Summary of Land Transactions in Nairobi in 2020	summary-of-land-transactions-in-nairobi-in-2020	\N	No media uploaded for this resource.	0	2025-12-04 07:53:45.725955-05	2025-12-04 07:53:45.725955-05
28	6	Summary of Land Transactions in Nairobi in 2019	summary-of-land-transactions-in-nairobi-in-2019	\N	No media uploaded for this resource.	0	2025-12-04 07:53:54.848652-05	2025-12-04 07:53:54.848652-05
29	6	Summary of Land Transactions in Nairobi in 2018	summary-of-land-transactions-in-nairobi-in-2018	\N	No media uploaded for this resource.	0	2025-12-04 07:54:04.907091-05	2025-12-04 07:54:04.907091-05
30	6	Summary of Land Transactions in Nairobi in 2017	summary-of-land-transactions-in-nairobi-in-2017	\N	No media uploaded for this resource.	0	2025-12-04 07:54:14.971088-05	2025-12-04 07:54:14.971088-05
31	6	Summary of Land Transactions in Nairobi in 2016	summary-of-land-transactions-in-nairobi-in-2016	\N	No media uploaded for this resource.	0	2025-12-04 07:54:22.196525-05	2025-12-04 07:54:22.196525-05
32	7	Summary of Land Transactions in Nairobi in 2015	summary-of-land-transactions-in-nairobi-in-2015	\N	No media uploaded for this resource.	0	2025-12-04 07:54:27.678697-05	2025-12-04 07:54:27.678697-05
33	7	Regional Land Registries	regional-land-registries	\N	No media uploaded for this resource.	0	2025-12-04 07:54:42.804378-05	2025-12-04 07:54:42.804378-05
34	8	New Land Property Registration Process	new-land-property-registration-process	\N	No media uploaded for this resource.	0	2025-12-04 07:54:50.714266-05	2025-12-04 07:54:50.714266-05
35	8	Customers Feedback, Complaint and Resolution	customers-feedback-complaint-and-resolution	\N	No media uploaded for this resource.	0	2025-12-04 07:55:16.346247-05	2025-12-04 07:55:16.346247-05
36	5	Summary of Land Transactions in Nairobi in 2022	summary-of-land-transactions-in-nairobi-in-2022	\N	No media uploaded for this resource.	0	2025-12-04 07:56:47.021266-05	2025-12-04 07:56:47.021266-05
37	5	Summary of Land Transactions in Nairobi in 2021	summary-of-land-transactions-in-nairobi-in-2021	\N	No media uploaded for this resource.	0	2025-12-04 07:56:58.16975-05	2025-12-04 07:56:58.16975-05
38	5	Summary of Land Transactions in Nairobi in 2020	summary-of-land-transactions-in-nairobi-in-2020	\N	No media uploaded for this resource.	0	2025-12-04 07:57:11.974491-05	2025-12-04 07:57:11.974491-05
39	5	Summary of Land Transactions in Nairobi in 2019	summary-of-land-transactions-in-nairobi-in-2019	\N	No media uploaded for this resource.	0	2025-12-04 07:57:25.410037-05	2025-12-04 07:57:25.410037-05
40	5	Summary of Land Transactions in Nairobi in 2018	summary-of-land-transactions-in-nairobi-in-2018	\N	No media uploaded for this resource.	0	2025-12-04 07:57:42.173553-05	2025-12-04 07:57:42.173553-05
41	5	Summary of Land Transactions in Nairobi in 2017	summary-of-land-transactions-in-nairobi-in-2017	\N	No media uploaded for this resource.	0	2025-12-04 07:57:56.083907-05	2025-12-04 07:57:56.083907-05
42	5	Summary of Land Transactions in Nairobi in 2016	summary-of-land-transactions-in-nairobi-in-2016	\N	No media uploaded for this resource.	0	2025-12-04 07:58:08.687969-05	2025-12-04 07:58:08.687969-05
43	5	Summary of Land Transactions in Nairobi in 2015	summary-of-land-transactions-in-nairobi-in-2015	\N	No media uploaded for this resource.	0	2025-12-04 07:58:19.85813-05	2025-12-04 07:58:19.85813-05
44	5	Regional Land Registries	regional-land-registries	\N	No media uploaded for this resource.	0	2025-12-04 07:58:30.537968-05	2025-12-04 07:58:30.537968-05
45	5	New Land Property Registration Process	new-land-property-registration-process	\N	No media uploaded for this resource.	0	2025-12-04 07:58:43.664736-05	2025-12-04 07:58:43.664736-05
46	5	Customers Feedback, Complaint and Resolution	customers-feedback-complaint-and-resolution	\N	No media uploaded for this resource.	0	2025-12-04 07:58:51.803806-05	2025-12-04 07:58:51.803806-05
47	3	Physical and Land Use Planning (Local Physical and Land Use Development Plan) Regulations, 2021	physical-and-land-use-planning-local-physical-and-land-use-development-plan-regulations-2021	\N	No media uploaded for this resource.	0	2025-12-04 09:09:58.033152-05	2025-12-04 09:09:58.033152-05
48	2	Steps to registration of community land	steps-to-registration-of-community-land	\N	No media uploaded for this resource.	0	2025-12-04 09:11:06.131785-05	2025-12-04 09:11:06.131785-05
\.


--
-- Data for Name: service_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.service_items (id, category_id, number, title, slug, description, requirements, timeline, fee, created_at) FROM stdin;
23	15	1	Registration of Deeds/Contracts/Bonds	registration-of-deeds-contracts-bonds	Registration of Deeds/Contracts/Bonds\n\nDescription: The registration of deeds, contracts, bonds, and similar legal instruments involves the formal recording of various documents under the Registration of Documents Act to confer legal recognition and enforceability.\n\nOnce registered, these documents serve as official evidence of the transactions or arrangements they represent, providing security, authenticity, and public notice. This process is essential in upholding the integrity of land and property dealings and ensuring that legal claims are properly documented and accessible.\n\nRequirements: Executed and attested documents, proof of stamp duty payment, copy of ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
24	15	2	Registration of Wills & Building Plans	registration-of-wills-building-plans	Registration of Wills & Building Plans\n\nDescription: The registration of wills and building plans involves the official lodging of these documents with the relevant authorities. This process enhances legal clarity, safeguards the rights of stakeholders, and supports orderly inheritance and development procedures.\n\nFor wills, this ensures that the testamentary intentions of a deceased person are preserved and can be legally referenced during estate administration.  \nFor building plans, registration validates the proposed construction against planning regulations and serves as an authoritative reference for compliance and future inspections. \n\nRequirements: Will or building plan document.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
25	15	3	Registration of Court Orders & Decrees	registration-of-court-orders-decrees	Registration of Court Orders & Decrees\n\nDescription: The registration of court orders and decrees entails the formal entry of judicial decisions into the official records to facilitate their recognition and enforcement. This process ensures that rulings issued by competent courts - such as property judgments, injunctions, or other legal directives - are acknowledged within the land administration system or other relevant registries. \n\nBy registering these decisions, affected parties can enforce the orders with legal backing, and third parties are duly informed of the judicial actions that may impact property rights or administrative processes.\n\nRequirements: Court order or decree.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
60	18	6	Plot Transfer via Succession	plot-transfer-via-succession	escription: This is the legal process through which ownership of a land parcel is transferred from a deceased person to their rightful heirs or beneficiaries.\n\nThis is done in accordance with succession laws and typically involves the submission of documents such as a will, Certificate of Confirmation of Grant, and Letters of Administration.\n\nThis process safeguards inheritance rights, reduces disputes, and facilitates the formal recognition of ownership by the successors.\n\nRequirements: Will, Certificate of Confirmation of Grant, Letter of Administration.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
61	18	7	Discharge of Charge/Outright Purchase Certificates	discharge-of-charge-outright-purchase-certificates	Description: This is the process by which a landowner is formally released from a financial obligation, such as a loan or charge. \n\nIn the case of government-issued settlement schemes, a certificate of outright purchase is provided to confirm that the beneficiary has fully paid for the allocated land.\n\nThis process involves verification of payment records and updating the land register to reflect unencumbered ownership.\n\nIt provides the landowner with clear and secure title, enabling future transactions and legal recognition of full ownership rights.\n\nRequirements: Proof of full loan repayment.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
62	18	8	Committee, Arbitration & Objection Cases	committee-arbitration-objection-cases	Description: These involve resolving disputes and addressing claims related to land adjudication through structured legal and administrative processes.\n\nCommittee cases are typically heard at the local level shortly after demarcation, while arbitration boards handle appeals against committee decisions.\n\nObjection register cases allow individuals to challenge entries in the adjudication register within a legally prescribed timeframe.\n\nEach case involves summoning relevant parties, examining evidence, and rendering decisions in accordance with adjudication laws thus ensuring fairness, protecting land rights, and providing avenues for redress in the formalization of land ownership.\n\nRequirements: Summons, attendance, filing forms within time limits.\n\nCharges: Kshs. 2,000 - 3,000 per case	[]	\N	\N	2025-12-04 05:20:50.98372
63	18	9	Appeal Filing	appeal-filing	Description: This involves submitting a formal written appeal to the Cabinet Secretary responsible for lands, challenging decisions made during the adjudication process - typically after the resolution of objection cases.\n\nAppeals must clearly state the grounds for disagreement and are required to be filed within 60 days of the objection decision.\n\nSuccessful appeals can lead to amendments in the adjudication register, safeguarding rightful land claims and promoting justice in land allocation.\n\nRequirements: Written appeal within 60 days after objection determination.\n\nCharges: Kshs. 5,000 per case + Kshs. 100 per page	[]	\N	\N	2025-12-04 05:20:50.98372
64	18	10	Civic Awareness & Sensitization	civic-awareness-sensitization	Description: This involves organized efforts to educate communities about land rights, laws, and administrative procedures, particularly in relation to adjudication, registration, and community land management.\n\nThese activities are conducted through public forums, workshops, and outreach programs aimed at empowering citizens with the knowledge needed to actively participate in land processes and make informed decisions.\n\nBy enhancing public understanding of land policies and systems, this service promotes transparency, encourages lawful land practices, and strengthens community involvement in land governance.\n\nRequirements: Participation by the community.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
65	18	11	Gazettement of Adjudication Programmes	gazettement-of-adjudication-programmes	Description: This involves the formal publication of notices in the Kenya Gazette to announce the commencement of land adjudication processes in specific community land areas. \n\nThe gazettement marks the official start of land rights documentation and serves to ensure transparency, legal compliance, and public participation in the adjudication process. \n\nThis step is legally required to inform the public, stakeholders, and relevant authorities on the areas selected for adjudication, the timeline, and the procedures to be followed.\n\nRequirements: Preparation and submission of inventory of unregistered land.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
86	20	13	Sale of Navigational Charts	sale-of-navigational-charts	Description: The sale of navigational charts involves providing institutions, maritime operators, and other users with accurate, officially sanctioned maps designed for navigation purposes. \n\nThese charts depict essential information such as coastlines, water depths, hazards, ports, and air or sea routes, aiding safe and efficient travel or transport.\n\nRequests are typically made in writing, and charts are offered in standard formats suited for practical use.\n\nRequirements: Written request.\n\nCharges: Minimum Kshs. 1,000 per sheet	[]	\N	\N	2025-12-04 05:31:53.730389
26	15	4	Registration of Vesting Orders	registration-of-vesting-orders	Registration of Vesting Orders\n\nDescription: The registration of vesting orders involves officially recording court-issued directives that transfer ownership of property without the need for a traditional conveyance process. \n\nThese orders are typically issued in situations such as estate settlements, company restructuring, or legal redress, where the court deems it appropriate to directly vest property rights in an individual or entity. \n\nBy registering a vesting order, the new ownership is formally recognized in the land records, ensuring the legal validity of the transfer and providing a clear, enforceable record of the change in title.\n\nRequirements: Court order, valuation report, proof of stamp duty payment, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
27	15	5	Lodging & Withdrawal of Cautions	lodging-withdrawal-of-cautions	Lodging & Withdrawal of Cautions\n\nDescription: Lodging and withdrawal of cautions is a legal process that allows individuals or entities to protect their interest in a piece of land by placing a restriction - known as a Caution - on the property. \n\nA Caution prevents any dealings, such as transfers or charges, from proceeding without the consent of the cautioner. It acts as a warning to third parties and ensures that the cautioner’s claim or interest is considered before any transaction is completed. \n\nConversely, withdrawal of a caution removes this restriction, allowing normal dealings to resume. \n\nThis mechanism is essential for safeguarding disputed or vulnerable property interests.\n\nRequirements: Duly filled caution form, copy of ID/passport, PIN certificate, 2 passport-size photos, proof of claim (for lodging).\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
28	15	6	Lease & Sub-lease Processing	lease-sub-lease-processing	Lease & Sub-lease Processing\n\nDescription: Lease and sub-lease processing involves the registration of lease agreements, sub-leases, or the renewal and extension of existing lease terms to legally formalize the rights of occupancy and use over a specified period. This process provides legal recognition to the lessee’s or sub-lessee’s interests in the property, ensuring that the terms of tenure are officially documented and enforceable.\n\nThe registration serves to protect both parties by clearly outlining obligations, rent terms, and duration, while also enabling lawful dealings such as financing, transfers, or development approvals tied to the leasehold interest.\n\nRequirements: Lease instrument, original title (for lease renewal), rent apportionment, proof of stamp duty payment, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
29	15	7	Registration of Power of Attorney	registration-of-power-of-attorney	Description: The registration of a Power of Attorney involves formally recording a legal document that grants one individual the authority to act on behalf of another in matters related to land and property. This could include signing documents, managing transactions, or making decisions concerning land ownership, leasing, or development. \n\nBy registering the Power of Attorney, the appointed agent’s authority is officially recognized and can be relied upon by third parties, including government agencies and financial institutions.\n\nThis process provides legal assurance, transparency, and accountability in the delegation of land-related responsibilities.\n\nRequirements: Executed instrument, proof of stamp duty payment, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
30	15	8	Partitioning of Property	partitioning-of-property	Description: Partitioning of property is the legal process through which jointly owned land is divided among co-owners, resulting in each party obtaining a distinct, titled portion of the property. \n\nThis division can be done voluntarily by mutual agreement or through a court order in cases of dispute.\n\nThe process ensures that each co-owner's share is clearly delineated and legally recognized, allowing for independent ownership, use, and further transactions. Partitioning promotes clarity in land ownership, prevents future conflicts, and facilitates efficient land management and development.\n\nRequirements: Executed partition instrument, valuation report, rent apportionment (for leasehold), stamp duty payment, original title, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
31	15	9	Processing of Mutations	processing-of-mutations	Description: Processing of mutations involves updating official land records to reflect changes in ownership or configuration resulting from subdivision or amalgamation of land parcels. \n\nWhen a piece of land is divided into smaller plots or multiple parcels are combined into a single holding, a mutation is necessary to formally document the change in the land registry. \n\nThis process ensures that the current layout, size, and ownership details are accurately recorded, providing a reliable basis for future transactions, taxation, and development control. It is a critical step in maintaining up-to-date and legally valid land records.\n\nRequirements: Mutation form, consent to subdivide, amended RIM, rent apportionment (for leasehold), original title, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
32	15	10	Corrections on Registered Documents	corrections-on-registered-documents	Description: Corrections on registered documents involve the formal rectification of errors found in land titles or related registration records to ensure accuracy and legal integrity. \n\nThese errors may include typographical mistakes, incorrect personal details, or misstatements of land size or boundaries. \n\nUpon verification and submission of the necessary documentation, the registrar amends the official records to reflect the correct information. \n\nThis process is essential for upholding the reliability of land records, preventing disputes, and enabling smooth future transactions involving the affected property.\n\nRequirements: Correction form, stamp duty receipt (if applicable), original title, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
33	15	11	Succession Applications	succession-applications	Description: Succession applications facilitate the legal transfer of land ownership from a deceased person to their rightful beneficiaries, as specified in a will or through a grant of letters of administration.\n\nThis process ensures that the deceased’s estate is distributed in accordance with succession laws and provides legal recognition of the new owners. It involves presenting relevant documents such as the will, certificate of confirmation of grant, and letters of administration for verification and registration.\n\nProper handling of succession applications safeguards inheritance rights, prevents disputes, and ensures that land ownership is accurately reflected in official records.\n\nRequirements: Form LRA 39 or 42, letters of administration, confirmation of grant, stamp duty proof, original title, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
34	15	12	Charges & Discharges	charges-discharges	Description: Charges and discharges refer to the registration and removal of financial claims, such as mortgages or loans, against a land title. \n\nWhen a property is used as security for a loan, a charge is registered to reflect the lender’s legal interest in the land until the debt is fully repaid. \n\nUpon settlement of the loan, a discharge is registered to remove this encumbrance, thereby restoring full ownership rights to the property holder. \n\nThis process ensures transparency in land transactions, protects the interests of lenders and borrowers, and maintains accurate land ownership records.\n\nRequirements: Charge: Charge instrument, consent, spousal consent, original title, stamp duty proof, \n\nID/passport, PIN certificate, 2 photos.\n\nDischarge: Discharge instrument, original title, stamp duty proof, ID/passport, PIN certificate, 2 photos.\n\nCharges: Charge: 0.1% of secured amount\n\nDischarge: 0.05% of discharged amount\n\nBoth: Kshs. 1,000 + Title fee Kshs. 2,500	[]	\N	\N	2025-12-04 04:57:25.866806
35	15	13	Land Transfers	land-transfers	Description: Land transfers involve the official registration of a change in property ownership resulting from transactions such as sales, gifts, or inheritance. \n\nThis process ensures that the new owner's rights are legally recognized and recorded in the land registry, providing security of tenure and enabling lawful use or further transactions. \n\nIt requires the submission of properly executed transfer instruments, supporting documents, and payment of applicable fees and taxes. \n\nBy formalizing ownership changes, land transfers uphold transparency, reduce the risk of disputes, and maintain the integrity of land administration systems.\n\nRequirements: Executed transfer, consent (if applicable), valuation report, rent clearance, stamp duty receipt, original title, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000 + Title fee Kshs. 2,500 + Stamp duty (2% or 4% of property value)	[]	\N	\N	2025-12-04 04:57:25.866806
36	15	14	Replacement of Lost Title/ Reconstruction of Land Register	replacement-of-lost-title-reconstruction-of-land-register	Description: Replacement of a lost title or reconstruction of the land register is a legal process that enables the re-issuance of a land ownership document that has been lost, destroyed, or damaged, and the restoration of corresponding official records. \n\nThis process involves submitting proof of loss—such as a police abstract and statutory declaration - along with public notices in newspapers and the Kenya Gazette to prevent fraud or competing claims. \n\nOnce verified, the land registry either re-issues the title or reconstructs the register to reflect accurate ownership and property details. \n\nThis safeguards land rights, restores administrative integrity, and ensures continuity in land dealings.\n\nRequirements: Application, indemnity form, police abstract, statutory declaration, newspaper & Kenya Gazette notice, ID/passport, PIN certificate, 2 passport-size photos.\n\nCharges: Kshs. 1,000 + Title replacement fee Kshs. 2,500	[]	\N	\N	2025-12-04 04:57:25.866806
37	15	15	Issuance of Search Certificate	issuance-of-search-certificate	Description: The issuance of a search certificate involves conducting an official land search to verify the ownership status of a property and identify any existing encumbrances such as charges, cautions, or restrictions. \n\nThis certificate provides reliable and up-to-date information sourced directly from the land registry, making it an essential document for due diligence before engaging in land transactions such as purchases, leases, or financing. \n\nBy confirming the legal standing of a property, the search certificate helps prevent fraud, protects the interests of all parties involved, and promotes transparency in land dealings.\n\nRequirements: Completed application form, ID, PIN certificate.\n\nCharges: Kshs. 1,000	[]	\N	\N	2025-12-04 04:57:25.866806
38	15	16	Handling Boundary Disputes	handling-boundary-disputes	Description: Handling boundary disputes involves mediating and resolving conflicts between landowners regarding the exact limits of their respective properties. \n\nThis process typically includes site inspections, examination of cadastral maps or RIMs, review of ownership documents, and, where necessary, engagement with surveyors or legal authorities. \n\nThe aim is to establish the true boundary and reach a mutually agreeable or legally binding resolution. \n\nBy addressing boundary issues promptly and fairly, this service helps maintain peaceful land relations, protects property rights, and ensures the accuracy of land records.\n\nRequirements: Complaint/request, title copy, parties’ addresses, map (RIM), mutation (if applicable).\n\nCharges: Kshs. 3,000	[]	\N	\N	2025-12-04 04:57:25.866806
39	15	17	Stamp Duty Assessment & Exemption	stamp-duty-assessment-exemption	Description: Stamp duty assessment and exemption involves evaluating land and property transactions to determine the applicable stamp duty payable or, in certain qualified cases, granting an exemption from the tax.\n\nThe assessment ensures that the correct amount - based on the transaction value and nature of the transfer—is calculated and collected in compliance with the law.\n\nIn situations such as charitable transfers or transactions involving public institutions, exemptions may be granted upon submission of supporting documents and formal approval. \n\nThis process ensures government revenue collection while also allowing for fairness and consideration of special circumstances under the stamp duty framework.\n\nRequirements: Assessment: Executed instruments.\n\nExemption: Application, instruments to be exempted, supporting documents, copy of title.\n\nCharges: Free	[]	\N	\N	2025-12-04 04:57:25.866806
40	15	18	Provision of Technical Advice	provision-of-technical-advice	Description: Provision of technical advice entails offering expert guidance on matters related to land registration, tailored to the specific nature of the issue at hand. \n\nThis service may include clarifications on registration procedures, document requirements, interpretation of land laws, or resolving registration anomalies. \n\nIt is typically provided by qualified land officers or registry staff to individuals, institutions, or professionals seeking accurate and authoritative information. \n\nBy ensuring that stakeholders are well-informed, this advisory support helps streamline land transactions, promotes compliance with legal frameworks, and enhances the efficiency and integrity of the land administration system.\n\nRequirements: Depends on nature of request.\n\nCharges: Free	[]	\N	\N	2025-12-04 04:57:25.866806
41	16	1	Valuation for Stamp Duty	valuation-for-stamp-duty	Description: Valuation for stamp duty is the process of determining the market value of land or property to calculate the correct amount of stamp duty payable during a transfer or registration. \n\nConducted by government valuers, this valuation ensures that the tax levied reflects the true value of the property and aligns with legal requirements. \n\nIt involves submitting a valuation request along with documents such as the transfer form, title deed, official search, and approved building plans. \n\nAccurate valuation for stamp duty promotes fairness, prevents revenue loss, and supports transparency in land and property transactions.\n\nRequirements: Valuation request, title, transfer document, search, map, plans.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:00:59.721306
42	16	2	Asset Valuation	asset-valuation	Description: Asset valuation is the process of assessing the market value of public assets, including land, buildings, and infrastructure, for purposes such as financial reporting, insurance, asset management, or planning.\n\nConducted by government valuers upon request from ministries, departments, and agencies (MDAs), the process involves reviewing ownership documents, asset registers, and site plans, often followed by physical inspection.\n\nAccurate valuation of public assets ensures proper accountability, aids in decision-making, and supports transparency and efficiency in the management of government property.\n\nRequirements: MDAs' request letter, asset register, ownership documents.\n\nCharges: 50% of the valuer’s scale of fees	[]	\N	\N	2025-12-04 05:00:59.721306
43	16	3	Government Leasing Valuation	government-leasing-valuation	Description: Government leasing valuation involves determining the rental value of property either being leased by the government from private entities or offered for lease by the government to tenants. \n\nIt is typically initiated through a formal request by the relevant government agency and requires ownership documents, property plans, and in some cases, inspection reports.\n\nThis valuation ensures that lease agreements reflect fair market rates and are consistent with current land use, property conditions, and local rental trends.\n\nRequirements: Request letter, ownership documents, plans, rental info.\n\nCharges: 50% of the valuer’s scale of fees	[]	\N	\N	2025-12-04 05:00:59.721306
44	16	4	Rent Determination	rent-determination	Description: Rent determination is the process of establishing fair and equitable rental rates for government-owned property that is leased or occupied by individuals, institutions, or other entities.\n\nThis involves assessing various factors such as location, property use, size, and prevailing market conditions.\n\nConducted upon requisition by the Director of Land Administration and supported by documents like title deeds, survey plans, and planning briefs, the process ensures that rental charges reflect the true value of the property.\n\nAccurate rent determination promotes effective public asset management, maximizes revenue, and upholds transparency in the use of government land and buildings.\n\nRequirements: Director's requisition, title, plans, physical planning briefs.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:00:59.721306
45	16	5	Rent Determination Preparation of  Valuation Roll	rent-determination-preparation-of-valuation-roll	Description: Preparation of a valuation roll involves compiling a comprehensive register of properties within a county, each with its assessed value, to support the administration of property rates and taxation.\n\nThe process is initiated upon request from a county government and requires supporting documents like development plans, official searches, maps, and resolutions.\n\nThis roll serves as the legal basis for revenue collection by county governments and includes details such as property location, ownership, use, size, and corresponding market value.\n\nRequirements: County government request, resolutions, maps, field inspection.\n\nCharges: 50% of the valuer’s scale of fees	[]	\N	\N	2025-12-04 05:00:59.721306
46	16	6	Probate Valuation	probate-valuation	Description: Probate valuation is the assessment of the market value of a deceased person's land or property for the purpose of estate administration and inheritance distribution.\n\nThis valuation is typically requested by the public trustee or legal representatives of the estate and is used to determine estate duty, facilitate the transfer of ownership to beneficiaries, and ensure equitable distribution of assets. \n\nAccurate probate valuation supports legal compliance in succession matters, and protects the rights of heirs and beneficiaries.\n\nRequirements: Request by public trustee, title, search, maps.\n\nCharges: Kshs. 2,000	[]	\N	\N	2025-12-04 05:00:59.721306
47	16	7	Valuation for Purchase/Sale by Government	valuation-for-purchase-sale-by-government	Description: Valuation for purchase or sale by the government involves determining the fair market value of land or property that the government intends to acquire or dispose of. \n\nThe valuation ensures that public funds are used responsibly in acquisitions and that properties sold by the government reflect their true worth. \n\nThis process is initiated through a formal instruction from the relevant government agency and is supported by ownership documents and, where applicable, a letter of offer.\n\nRequirements: Letter of instruction, ownership documents, offer letter.\n\nCharges: 50% of the valuer’s scale of fees	[]	\N	\N	2025-12-04 05:00:59.721306
48	16	8	Valuation for Arbitration/Court Purposes	valuation-for-arbitration-court-purposes	Description: Valuation for arbitration or court purposes involves providing an objective assessment of the value of land or property to support the resolution of legal disputes. \n\nTypically requested by a court or tribunal, this type of valuation is used as evidence in cases involving compensation claims, boundary disagreements, expropriation, or contested transactions. \n\nIt requires submission of a formal valuation request, relevant ownership documents, and details of the dispute. \n\nConducted by accredited government valuers, this process ensures that judicial and arbitration decisions are informed by accurate and unbiased property valuations, thereby promoting fair and just outcomes.\n\nRequirements: Court valuation request, ownership documents.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:00:59.721306
49	17	1	Approval of Sub-division/Amalgamation Schemes	approval-of-sub-division-amalgamation-schemes	Description: Approval of sub-division or amalgamation schemes is the formal process through which proposed changes to land parcels - either dividing a single plot into smaller units or combining multiple plots into one - are reviewed and authorized by the Directorate.\n\nThis approval ensures that the proposed alterations align with zoning regulations, planning standards, and land use policies. \n\nIt typically requires submission of a valid PPA2 form, consent from the Land Control Board (for agricultural land), and positive technical comments from land administration, planning, and survey departments. \n\nThe process safeguards orderly development and supports proper land management.\n\nRequirements: County approval (PPA2), consent from Land Control Board (for agricultural land), and positive comments from relevant officers.	[]	\N	\N	2025-12-04 05:14:06.324888
50	17	2	Approval for Change/Extension of User	approval-for-change-extension-of-user	Description: Approval for change or extension of user is the official authorization granted to alter the designated use of a parcel of land - such as converting it from residential to commercial - or to extend its current use beyond the originally approved scope. \n\nThis process ensures that the proposed use complies with zoning laws, environmental regulations, and urban development plans. \n\nIt involves submission of a valid PPA2 form, consent from the Land Control Board for agricultural land, a planning brief, newspaper notification, and assessments from relevant technical officers. \n\nSuch approval is vital for promoting sustainable land use and preventing conflicts or unregulated development.\n\nRequirements: County approval (PPA2), consent from Land Control Board (for agricultural land), planning brief, newspaper notice, and officer comments.\n\nCharges: Kshs. 10,000 approval fee	[]	\N	\N	2025-12-04 05:14:06.324888
51	17	3	Approval for Lease Extensions	approval-for-lease-extensions	Description: Approval for change or extension of user is the official authorization granted to alter the designated use of a parcel of land - such as converting it from residential to commercial - or to extend its current use beyond the originally approved scope. \n\nThis process ensures that the proposed use complies with zoning laws, environmental regulations, and urban development plans. \n\nIt involves submission of a valid PPA2 form, consent from the Land Control Board for agricultural land, a planning brief, newspaper notification, and assessments from relevant technical officers. \n\nSuch approval is vital for promoting sustainable land use and preventing conflicts or unregulated development.\n\nRequirements: County approval (PPA2), consent from Land Control Board (for agricultural land), planning brief, newspaper notice, and officer comments.\n\nCharges: Kshs. 10,000 approval fee	[]	\N	\N	2025-12-04 05:14:06.324888
52	17	4	Determination of Ground Rent	determination-of-ground-rent	Description: Determination of ground rent involves calculating and assigning the appropriate annual rent payable to the government for leasehold land, particularly after events such as subdivision, change of user, or lease extension. \n\nThis process ensures that the rent reflects the current land value, intended use, and any modifications to the parcel's size or status. \n\nIt requires submission of relevant approvals, survey plans, and other supporting documents, and is typically carried out by valuation and land administration officers. \n\nAccurate determination of ground rent promotes fairness, enhances revenue collection, and ensures consistency in the management of public land resources..\n\nRequirements: Relevant approvals and RIM/Survey plan.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:14:06.324888
53	17	5	Lease Processing	lease-processing	Description: Lease processing involves the preparation, verification, and registration of lease documents to formalize the granting of leasehold rights over a parcel of land. \n\nThis process typically follows the issuance of a letter of allotment or approval of a subdivision scheme and includes the creation of lease instruments, deed plans, and payment of legal and administrative fees. \n\nIt ensures that the lessee's rights are clearly defined and legally recognized, enabling lawful use, development, or transfer of the leased property. \n\nLease processing is a critical step in land administration, providing security of tenure and supporting orderly land management.\n\nRequirements: Allotment letter or scheme approval, legal fees payment, RIM/Deed Plan.\n\nCharges: Conveyance fee Kshs. 3,000; Registration fee Kshs. 1,000; Stamp duty as assessed	[]	\N	\N	2025-12-04 05:14:06.324888
54	17	6	Issuance of Land Control Board Consent	issuance-of-land-control-board-consent	Description: Issuance of Land Control Board (LCB) consent is a mandatory legal requirement for certain land transactions, particularly involving agricultural land, such as sales, leases, transfers, or sub-divisions. \n\nThis consent ensures that the transaction complies with land use policies and that the land remains productive and within the intended purpose.\n\nApplicants must submit a duly completed application form along with an official search of the land. \n\nThe board evaluates the request and, if approved, issues formal consent that must be registered alongside the transaction documents. \n\nThis process safeguards land rights and promotes sustainable land management.\n\nRequirements: Duly filled application, official search.\n\nCharges: Application fee Kshs. 3,000; Special Consent fee Kshs. 10,000	[]	\N	\N	2025-12-04 05:14:06.324888
55	18	1	Recognition of Interest in Community Land	recognition-of-interest-in-community-land	Description: Recognition of interest in community land involves the formal process of identifying, validating, and documenting claims made by individuals or groups over land held collectively by a community, in accordance with the Community Land Act.\n\nThis process ensures that customary rights, ancestral claims, or other forms of occupation and use are legally acknowledged and protected.\n\nRecognizing such interests helps to secure tenure, prevent conflicts, and support the sustainable management and development of community land resources.\n\nRequirements: Application in Form CLA 8.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
56	18	2	Updating Community Land Registers	updating-community-land-registers	Description: Updating community land registers involves revising and maintaining accurate records of individuals who are recognized members of a community holding land collectively under the Community Land Act.\n\nThis process ensures that any changes in membership - such as additions, removals, or corrections due to succession, migration, or internal restructuring - are formally recorded.\n\nMaintaining an up-to-date community land register is essential for transparency, protecting members’ rights, and enabling fair decision-making in land use and allocation within the community.\n\nRequirements: Application and minutes of meeting.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
57	18	3	Community Land Dispute Resolution	community-land-dispute-resolution	Description: Community land dispute resolution involves addressing and settling conflicts that arise over claims to land held under communal ownership, often rooted in historical use, boundaries, or membership rights.\n\nThis process typically includes mediation, arbitration, or adjudication facilitated by local committees, land administrators, or other designated authorities under the framework of the Community Land Act. \n\nResolutions are based on community consensus, documentary evidence, and field assessments, ensuring that decisions are fair, inclusive, and legally recognized.\n\nRequirements: Application to lodge a dispute in Form CLA11.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
58	18	4	Customary Right of Occupation	customary-right-of-occupation	Description: Customary right of occupation refers to the formal recognition and issuance of rights allowing individuals or families to occupy and use land under traditional or customary tenure systems.\n\nApplicants are required to submit a formal request, usually in the prescribed form, and the claim is verified through community structures and local land administration authorities.\n\nGranting customary rights provides legal backing to long-standing traditional land use, protects occupants from eviction, and promotes security of tenure while respecting cultural and historical land practices.\n\nRequirements: Application in Form CLA 9.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:20:50.98372
59	18	5	Community Land Allocation/Offer Letters	community-land-allocation-offer-letters	Description: Community land allocation and the issuance of offer letters involve the formal process through which settlement plots within community land are distributed to eligible individuals or groups.\n\nThis process includes verifying eligibility, conducting balloting (if necessary), and issuing official offer letters that confirm the allocation.\n\nThe offer letter serves as a preliminary step toward full ownership documentation and helps ensure transparency, fairness, and accountability in the management and distribution of community land resources.\n\nRequirements: National ID, ballot paper, original offer letter.\n\nCharges: Kshs. 2,500	[]	\N	\N	2025-12-04 05:20:50.98372
66	18	12	Sale of Case Proceedings & Maps	sale-of-case-proceedings-maps	Description: The sale of case proceedings and maps involves providing certified copies of adjudication-related documents, including hearing transcripts, decisions, and demarcation or sketch maps, to individuals or institutions upon request at a prescribed fee based on the number of pages or map size.\n\nThese records serve as official references for land disputes, succession claims, boundary definitions, and administrative reviews.\n\nThis service ensures transparency, supports legal processes, and gives stakeholders access to accurate and authoritative land information.\n\nRequirements: Submission of application on demand.\n\nCharges: Kshs. 100 - 1,000 per page	[]	\N	\N	2025-12-04 05:20:50.98372
67	19	1	Approval of Building Plans	approval-of-building-plans	Description: Approval of building plans involves the technical evaluation and formal authorization of proposed architectural designs to ensure they comply with zoning regulations, building codes, and planning policies. \n\nApplicants must submit their plans for assessment by the Directorate, which review aspects such as structural integrity, land use compatibility, and environmental impact. \n\nThis process is essential for promoting safe, orderly, and sustainable development.\n\nRequirements: Recommendations from authorities.\n\nCharges: Minimum Kshs. 750	[]	\N	\N	2025-12-04 05:24:56.527131
68	19	2	Processing of  Building Plans	processing-of-building-plans	Description: Processing of building plans entails the administrative and technical handling of submitted architectural drawings and related documents to facilitate their review, approval, and official registration. \n\nThis process includes checking for compliance with local planning regulations, zoning requirements, and building codes. It also involves verifying the authenticity of ownership documents and site plans. \n\nThe formal processing ensures that developments are planned responsibly, meet safety and legal standards, and are compatible with the surrounding environment.\n\nRequirements: Site plan, building plan, certified title.\n\nCharges: Kshs. 500–10,000 depending on location	[]	\N	\N	2025-12-04 05:24:56.527131
69	19	3	Issuance of Compliance Certificates	issuance-of-compliance-certificates	Description: Issuance of compliance certificates involves granting an official document that confirms a development or construction project has adhered to approved building plans, planning regulations, and relevant legal requirements.\n\nThis certificate is typically issued following a site inspection and submission of the previous year's compliance certificate.\n\nIt serves as evidence that the property meets regulatory standards and is suitable for occupation or continued use.\n\nRequirements: Previous compliance certificate, site visit.\n\nCharges: Kshs. 500 - 10,000 depending on zone	[]	\N	\N	2025-12-04 05:24:56.527131
70	19	4	Sale of Plans (Graphical & Topographical)	sale-of-plans-graphical-topographical	Description: The sale of graphical and topographical plans involves providing printed or digital copies of official maps and planning documents to individuals, developers, or institutions upon request. \n\nThis service supports transparency in planning, facilitates informed decision-making, and promotes orderly spatial development by making accurate and up-to-date mapping information accessible to the public.\n\nThese plans, which may include layouts, land use zones, elevations, and physical features, are essential for land development, construction, research, or academic purposes.\n\nCustomers can choose from various sizes and formats, including color or black-and-white prints.\n\nRequirements: Official written request.\n\nCharges: Kshs. 200 - 3,000 depending on size and type	[]	\N	\N	2025-12-04 05:24:56.527131
71	19	5	Processing of Environmental Impact Assessments	processing-of-environmental-impact-assessments	Description: Processing of Environmental Impact Assessments (EIA) involves the review and evaluation of submitted EIA reports to determine the potential environmental effects of proposed developments or projects.\n\nThis process ensures that environmental considerations are integrated into planning and is vital for protecting natural resources, public health, promoting sustainable development practices and decision-making before project implementation.\n\nAuthorities assess whether the proposed activities comply with environmental laws, sustainability standards, and land use plans.\n\nBased on the findings, approvals or recommendations may be issued, including conditions to mitigate adverse impacts.\n\nRequirements: Comprehensive EIA Report.\n\nCharges: Kshs. 3,000 per report	[]	\N	\N	2025-12-04 05:24:56.527131
72	19	6	Preparation of Part Development Plans (PDP)	preparation-of-part-development-plans-pdp	escription: Preparation of Part Development Plans (PDP) involves the drafting of detailed land use plans that guide the physical development of specific areas within a jurisdiction. \n\nThese plans outline designated zones for residential, commercial, industrial, and public uses, as well as infrastructure layouts such as roads and utilities. \n\nPDPs serve as essential tools for orderly land use, ensuring that developments are properly structured, environmentally sustainable, and aligned with broader urban planning goals.\n\nRequirements: Ownership documents, planning brief, public notice.\n\nCharges: Kshs. 200 - 1,000	[]	\N	\N	2025-12-04 05:24:56.527131
73	19	7	Authentication of PDPs	authentication-of-pdps	Description: Authentication of Part Development Plans (PDPs) involves the official verification and certification of development plans to confirm their accuracy, legitimacy, and compliance with approved planning standards.\n\nThis service upholds the integrity of spatial planning and supports transparent and accountable land management.\n\nUpon successful authentication, the plan becomes a legally recognized reference for land use, guiding construction, subdivision, and investment decisions.\n\nRequirements: Written request.\n\nCharges: Kshs. 200 - 500	[]	\N	\N	2025-12-04 05:24:56.527131
74	20	1	Land Survey & Mapping Consultancy	land-survey-mapping-consultancy	Description: Land survey and mapping consultancy involves offering specialized professional advice on matters related to land measurement, boundary definition, and spatial data interpretation.\n\nThis service supports individuals, institutions, and developers in understanding technical requirements for surveys, map usage, and compliance with national mapping standards.\n\nIt may include guidance on survey procedures, georeferencing, preparation of cadastral plans, and interpretation of topographical data.\n\nRequirements: Written request and assessment by Director of Surveys.\n\nCharges: Kshs. 3,000 per hour (as assessed).	[]	\N	\N	2025-12-04 05:31:53.730389
75	20	2	Land Survey Searches	land-survey-searches	Description: Land survey searches involve accessing and reviewing official survey records, plans, and maps to obtain detailed information about a specific parcel of land.\n\nThese searches provide data such as boundary dimensions, beacons, survey numbers, and historical changes to the land’s configuration. \n\nThis service is essential for verifying property boundaries, supporting land transactions, planning developments, or resolving disputes.\n\nRequirements: Presentation of copy of title.\n\nCharges: Kshs. 500	[]	\N	\N	2025-12-04 05:31:53.730389
76	20	3	Geo-referencing & Sectional Surveys	geo-referencing-sectional-surveys	Description: Geo-referencing and sectional surveys involve the precise mapping and spatial referencing of individual units within a larger property - such as apartments or office suites - based on global positioning coordinates and legal boundaries.\n\nThis process ensures that each sectional unit is accurately located and identifiable within a national geospatial framework, allowing for clear delineation of ownership, utilities, and access rights. \n\nIt is particularly important for properties governed by sectional titles and is required for registration and legal recognition of sectional unit.\n\nRequirements: Written request.\n\nCharges: Kshs. 5,000	[]	\N	\N	2025-12-04 05:31:53.730389
77	20	4	Resolution of Boundary Disputes	resolution-of-boundary-disputes	Description: Resolution of boundary disputes involves the use of survey expertise and official land records to settle disagreements between property owners regarding the exact location of their shared boundaries.\n\nThis process typically includes field inspections, verification of cadastral plans or Registry Index Maps (RIMs), analysis of ownership documents, and, when necessary, the application of court orders or summons.\n\nIt is a vital function in maintaining order and trust in land administration.\n\nRequirements: Proof of ownership, RIM, location map, court order.\n\nCharges: Kshs. 10,000 + transport and DSA as per SRC	[]	\N	\N	2025-12-04 05:31:53.730389
78	20	5	Land Demarcation & Survey	land-demarcation-survey	Description: Land demarcation and survey in adjudication areas involves the systematic identification, measurement, and mapping of individual land parcels within regions undergoing land adjudication.\n\nThis process establishes clear and permanent boundaries for each parcel, often marked with physical beacons, and documents ownership or customary rights. \n\nIt is a foundational step in formalizing land tenure, particularly in rural or previously unregistered areas, enabling the issuance of title deeds or other legal documents.\n\nRequirements: Request to relevant authority.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:31:53.730389
79	20	6	Survey for New Grants	survey-for-new-grants	Description: Survey for new grants involves conducting official land surveys to accurately define and map parcels of land that have been newly allocated by the government or other authorized bodies.\n\nThis process includes placing physical boundary markers, preparing survey plans or deed plans, and ensuring that the land conforms to planning and zoning regulations.\n\nThe resulting survey data is essential for the issuance of title documents and for registering the land in the national cadastre.\n\nRequirements: Letter of allotment and payment receipt.\n\nCharges: Minimum Kshs. 20,000 x H (√Area) + 3% of land value	[]	\N	\N	2025-12-04 05:31:53.730389
80	20	7	RIM Amendments/Cadastral Plan Prep	rim-amendments-cadastral-plan-prep	Description: RIM (Registry Index Map) amendments and cadastral plan preparation involve updating official survey records to reflect changes in land boundaries, subdivisions, consolidations, or corrections. \n\nThis process ensures that cadastral maps accurately represent the current status of land parcels, including their size, shape, and location.\n\nUpdates may be initiated following approved land transactions or survey work by licensed professionals and are verified by the Director of Surveys before being officially recorded.\n\nAccurate and up-to-date RIMs and cadastral plans are essential for land registration, planning, dispute resolution, and maintaining the integrity of the national land information system.\n\nRequirements: Indent, release letter, payment receipt.\n\nCharges: Kshs. 2,500 per parcel	[]	\N	\N	2025-12-04 05:31:53.730389
81	20	8	Sale of  Various Maps & Atlases	sale-of-various-maps-atlases	Description: The sale of various maps and atlases involves providing individuals, institutions, and organizations with printed copies of topographical, cadastral, thematic, and national maps, as well as atlases that contain compiled geographic data.\n\nThese materials serve diverse purposes, including education, research, planning, navigation, and development. \n\nCustomers can request specific map types and sizes, such as A0, A1, or A2 formats, in black-and-white or color versions. \n\nThis service ensures public access to authoritative spatial information and supports informed decision-making in land use, environmental management, infrastructure development, and policy planning.\n\nRequirements: Written application.\n\nCharges: Kshs. 500 - 1,000 depending on map type and size	[]	\N	\N	2025-12-04 05:31:53.730389
82	20	9	Topographical Surveys	topographical-surveys	Description: Topographical surveys involve the detailed measurement and mapping of the natural and man-made features of a piece of land, including elevations, contours, trees, buildings, roads, and drainage systems. \n\nThese surveys provide essential data for planning, engineering, construction, and environmental assessment, enabling accurate design and informed decision-making.\n\nConducted using advanced surveying equipment, the results are presented in the form of topographical maps that depict the terrain and physical layout of the land.\n\nRequirements: Ownership proof and request.\n\nCharges: Kshs. 30,000 per Ha or part thereof	[]	\N	\N	2025-12-04 05:31:53.730389
83	20	10	Comments on Developments	comments-on-developments	Description: Comments on developments involve the provision of professional input by the Survey Department on proposed land development activities. \n\nThese comments assess whether the proposed projects align with approved survey plans, cadastral data, and land use regulations. \n\nThe process typically includes reviewing the PPA2 form, conducting a site inspection if necessary, and evaluating the implications of the development on existing boundaries and infrastructure. \n\nRequirements: PPA2, development application, official search.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:31:53.730389
84	20	11	Online Sale & Processing of Mutation Forms	online-sale-processing-of-mutation-forms	Description: The online sale and processing of mutation forms enable licensed surveyors to access and obtain official forms required for recording changes in land ownership or configuration, such as subdivisions or amalgamations. \n\nThrough digital platforms like Ardhisasa, surveyors can request, fill out, and submit these forms electronically, streamlining the mutation process and reducing administrative delays.\n\nThis service ensures that only registered professionals handle sensitive land data, promotes efficiency and transparency in land transactions, and supports the modernization of land administration systems through digital service delivery.\n\nRequirements: Consent for land transaction, registration on Ardhisasa.\n\nCharges: Free	[]	\N	\N	2025-12-04 05:31:53.730389
85	20	12	Approval for Aerial Surveys	approval-for-aerial-surveys	Description: Approval for aerial surveys involves granting official authorization to individuals or institutions wishing to conduct aerial mapping or photography over specific areas of land. \n\nApplicants must submit a formal request detailing the area of coverage and intended timeframe, along with clearance from the Department of Defence (DoD) and the Kenya Civil Aviation Authority.\n\nBy regulating aerial surveys, this service safeguards national security, protects privacy, and ensures that spatial data is collected responsibly and lawfully.\n\nRequirements: Application letter, DoD and Civil Aviation clearance.\n\nCharges: Minimum Kshs. 10,000	[]	\N	\N	2025-12-04 05:31:53.730389
87	20	14	Planning, Designing & Printing Services	planning-designing-printing-services	Description: Planning, designing, and printing services involve the creation and production of high-quality maps, plans, and related spatial documents based on user specifications or approved templates.\n\nThis includes cartographic design, layout formatting, and the printing of materials such as cadastral maps, development plans, and topographic illustrations.\n\nThese services are often requested by government agencies, private developers, surveyors, or educational institutions to support planning, analysis, and presentation needs.\n\nRequirements: Request and sample of required works.\n\nCharges: Minimum Kshs. 500 - 1,000 per sheet	[]	\N	\N	2025-12-04 05:31:53.730389
88	20	15	Giving Evidence in Court	giving-evidence-in-court	Description: Surveyors provide expert witness testimony in legal proceedings related to land and property matters including presenting technical findings, clarifying survey data, and explaining boundary positions or land measurements based on official records and fieldwork.\n\nThis service ensures that judicial decisions are informed by accurate, authoritative, and unbiased spatial information which is often critical in resolving disputes involving land ownership, encroachments, or valuation disagreements.\n\nSurveyors appear in court upon summons and may be required to submit detailed reports or maps as part of their testimony.\n\nRequirements: Court summons.\n\nCharges: Kshs. 3,000 + transport, accommodation, and DSA	[]	\N	\N	2025-12-04 05:31:53.730389
\.


--
-- Data for Name: tenders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenders (id, tender_no, description, start_date, closing_datetime, document_path, document_size, document_name, document_mime_type, is_active, created_at, updated_at) FROM stdin;
5	qwqwq	klkl	2025-12-09	2025-12-10 12:00:00-05	/uploads/tenders/1765197707072-Hacking._Rooting_and_Jailbreaking.pdf	1755451	Hacking. Rooting and Jailbreaking.pdf	application/pdf	t	2025-12-08 07:41:47.08534-05	2025-12-08 07:41:47.08534-05
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 20, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faqs_id_seq', 12, true);


--
-- Name: forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.forms_id_seq', 5, true);


--
-- Name: gallery_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gallery_media_id_seq', 58, true);


--
-- Name: gazette_notices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gazette_notices_id_seq', 3, true);


--
-- Name: gazette_resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gazette_resources_id_seq', 8, true);


--
-- Name: land_registries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.land_registries_id_seq', 2, true);


--
-- Name: land_registries_serial_no_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.land_registries_serial_no_seq', 2, true);


--
-- Name: media_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_files_id_seq', 7, true);


--
-- Name: media_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_items_id_seq', 9, true);


--
-- Name: registry_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.registry_locations_id_seq', 12, true);


--
-- Name: resource_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.resource_sections_id_seq', 9, true);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.resources_id_seq', 48, true);


--
-- Name: service_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_items_id_seq', 88, true);


--
-- Name: tenders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tenders_id_seq', 5, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: forms forms_form_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_form_number_key UNIQUE (form_number);


--
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);


--
-- Name: gallery_media gallery_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_media
    ADD CONSTRAINT gallery_media_pkey PRIMARY KEY (id);


--
-- Name: gazette_notices gazette_notices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gazette_notices
    ADD CONSTRAINT gazette_notices_pkey PRIMARY KEY (id);


--
-- Name: gazette_notices gazette_notices_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gazette_notices
    ADD CONSTRAINT gazette_notices_slug_key UNIQUE (slug);


--
-- Name: gazette_resources gazette_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gazette_resources
    ADD CONSTRAINT gazette_resources_pkey PRIMARY KEY (id);


--
-- Name: land_registries land_registries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.land_registries
    ADD CONSTRAINT land_registries_pkey PRIMARY KEY (id);


--
-- Name: media_files media_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_pkey PRIMARY KEY (id);


--
-- Name: media_items media_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_pkey PRIMARY KEY (id);


--
-- Name: media_items media_items_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_slug_key UNIQUE (slug);


--
-- Name: registry_locations registry_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registry_locations
    ADD CONSTRAINT registry_locations_pkey PRIMARY KEY (id);


--
-- Name: resource_sections resource_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_sections
    ADD CONSTRAINT resource_sections_pkey PRIMARY KEY (id);


--
-- Name: resource_sections resource_sections_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_sections
    ADD CONSTRAINT resource_sections_slug_key UNIQUE (slug);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: resources resources_section_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_section_id_slug_key UNIQUE (section_id, slug);


--
-- Name: service_items service_items_category_id_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_items
    ADD CONSTRAINT service_items_category_id_number_key UNIQUE (category_id, number);


--
-- Name: service_items service_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_items
    ADD CONSTRAINT service_items_pkey PRIMARY KEY (id);


--
-- Name: service_items service_items_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_items
    ADD CONSTRAINT service_items_slug_key UNIQUE (slug);


--
-- Name: tenders tenders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_pkey PRIMARY KEY (id);


--
-- Name: tenders tenders_tender_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_tender_no_key UNIQUE (tender_no);


--
-- Name: idx_gallery_media_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_media_created_at ON public.gallery_media USING btree (created_at DESC);


--
-- Name: idx_gallery_media_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_media_order ON public.gallery_media USING btree ("order", id);


--
-- Name: idx_gallery_media_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_media_type ON public.gallery_media USING btree (type);


--
-- Name: idx_media_files_item_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_files_item_order ON public.media_files USING btree (media_item_id, "order");


--
-- Name: idx_resource_sections_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resource_sections_order ON public.resource_sections USING btree ("order");


--
-- Name: idx_resources_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resources_order ON public.resources USING btree ("order");


--
-- Name: idx_resources_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resources_section_id ON public.resources USING btree (section_id);


--
-- Name: idx_service_items_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_items_category ON public.service_items USING btree (category_id);


--
-- Name: idx_service_items_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_items_slug ON public.service_items USING btree (slug);


--
-- Name: idx_tenders_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tenders_active ON public.tenders USING btree (is_active);


--
-- Name: idx_tenders_closing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tenders_closing ON public.tenders USING btree (closing_datetime);


--
-- Name: forms set_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.forms FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: faqs update_faqs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: gallery_media update_gallery_media_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_gallery_media_updated_at BEFORE UPDATE ON public.gallery_media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: gazette_notices update_gazette_notices_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_gazette_notices_updated_at BEFORE UPDATE ON public.gazette_notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: land_registries update_land_registries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_land_registries_updated_at BEFORE UPDATE ON public.land_registries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: gazette_resources gazette_resources_notice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gazette_resources
    ADD CONSTRAINT gazette_resources_notice_id_fkey FOREIGN KEY (notice_id) REFERENCES public.gazette_notices(id) ON DELETE CASCADE;


--
-- Name: media_files media_files_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- Name: registry_locations registry_locations_registry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registry_locations
    ADD CONSTRAINT registry_locations_registry_id_fkey FOREIGN KEY (registry_id) REFERENCES public.land_registries(id) ON DELETE CASCADE;


--
-- Name: resources resources_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.resource_sections(id) ON DELETE CASCADE;


--
-- Name: service_items service_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_items
    ADD CONSTRAINT service_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 4XjAQbUApbFdccV9W9ivQvBwn8hGcofo2HTyZ3HN8nGPLXaiwWOe1wW9Td70dg8

