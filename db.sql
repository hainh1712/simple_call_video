PGDMP                          {            ITSS-HedSocial    15.3    15.3 A    K           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            L           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            M           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            N           1262    16860    ITSS-HedSocial    DATABASE     �   CREATE DATABASE "ITSS-HedSocial" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Vietnamese_Vietnam.1258';
     DROP DATABASE "ITSS-HedSocial";
                postgres    false            �            1259    25415    alembic_version    TABLE     X   CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);
 #   DROP TABLE public.alembic_version;
       public         heap    postgres    false            �            1259    16992    comment_vote    TABLE       CREATE TABLE public.comment_vote (
    id integer NOT NULL,
    user_id integer NOT NULL,
    comment_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    upvote integer,
    downvote integer
);
     DROP TABLE public.comment_vote;
       public         heap    postgres    false            �            1259    16991    comment_vote_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comment_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.comment_vote_id_seq;
       public          postgres    false    227            O           0    0    comment_vote_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.comment_vote_id_seq OWNED BY public.comment_vote.id;
          public          postgres    false    226            �            1259    16937    comments    TABLE     �   CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    content character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);
    DROP TABLE public.comments;
       public         heap    postgres    false            �            1259    16936    comments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comments_id_seq;
       public          postgres    false    221            P           0    0    comments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;
          public          postgres    false    220            �            1259    16957    post_tag    TABLE     u   CREATE TABLE public.post_tag (
    id integer NOT NULL,
    post_id integer NOT NULL,
    tag_id integer NOT NULL
);
    DROP TABLE public.post_tag;
       public         heap    postgres    false            �            1259    16956    post_tag_id_seq    SEQUENCE     �   CREATE SEQUENCE public.post_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.post_tag_id_seq;
       public          postgres    false    223            Q           0    0    post_tag_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.post_tag_id_seq OWNED BY public.post_tag.id;
          public          postgres    false    222            �            1259    16974 	   post_vote    TABLE       CREATE TABLE public.post_vote (
    id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    upvote integer,
    downvote integer
);
    DROP TABLE public.post_vote;
       public         heap    postgres    false            �            1259    16973    post_vote_id_seq    SEQUENCE     �   CREATE SEQUENCE public.post_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.post_vote_id_seq;
       public          postgres    false    225            R           0    0    post_vote_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.post_vote_id_seq OWNED BY public.post_vote.id;
          public          postgres    false    224            �            1259    16922    posts    TABLE     @  CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    image_url character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    is_deleted boolean
);
    DROP TABLE public.posts;
       public         heap    postgres    false            �            1259    16921    posts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.posts_id_seq;
       public          postgres    false    219            S           0    0    posts_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;
          public          postgres    false    218            �            1259    16903    tags    TABLE     [   CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.tags;
       public         heap    postgres    false            �            1259    16902    tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tags_id_seq;
       public          postgres    false    215            T           0    0    tags_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;
          public          postgres    false    214            �            1259    16912    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    classname character varying NOT NULL,
    grade character varying NOT NULL,
    avatar_url character varying,
    cover_image_url character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16911    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    217            U           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    216            �           2604    25434    comment_vote id    DEFAULT     r   ALTER TABLE ONLY public.comment_vote ALTER COLUMN id SET DEFAULT nextval('public.comment_vote_id_seq'::regclass);
 >   ALTER TABLE public.comment_vote ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226    227            �           2604    25435    comments id    DEFAULT     j   ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);
 :   ALTER TABLE public.comments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220    221            �           2604    25436    post_tag id    DEFAULT     j   ALTER TABLE ONLY public.post_tag ALTER COLUMN id SET DEFAULT nextval('public.post_tag_id_seq'::regclass);
 :   ALTER TABLE public.post_tag ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            �           2604    25437    post_vote id    DEFAULT     l   ALTER TABLE ONLY public.post_vote ALTER COLUMN id SET DEFAULT nextval('public.post_vote_id_seq'::regclass);
 ;   ALTER TABLE public.post_vote ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225            �           2604    25438    posts id    DEFAULT     d   ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);
 7   ALTER TABLE public.posts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    25439    tags id    DEFAULT     b   ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
 6   ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    25440    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            H          0    25415    alembic_version 
   TABLE DATA           6   COPY public.alembic_version (version_num) FROM stdin;
    public          postgres    false    228   �J       G          0    16992    comment_vote 
   TABLE DATA           i   COPY public.comment_vote (id, user_id, comment_id, created_at, updated_at, upvote, downvote) FROM stdin;
    public          postgres    false    227   	K       A          0    16937    comments 
   TABLE DATA           Y   COPY public.comments (id, user_id, post_id, content, created_at, updated_at) FROM stdin;
    public          postgres    false    221   �K       C          0    16957    post_tag 
   TABLE DATA           7   COPY public.post_tag (id, post_id, tag_id) FROM stdin;
    public          postgres    false    223   �L       E          0    16974 	   post_vote 
   TABLE DATA           c   COPY public.post_vote (id, user_id, post_id, created_at, updated_at, upvote, downvote) FROM stdin;
    public          postgres    false    225   �M       ?          0    16922    posts 
   TABLE DATA           o   COPY public.posts (id, user_id, title, description, image_url, created_at, updated_at, is_deleted) FROM stdin;
    public          postgres    false    219   �O       ;          0    16903    tags 
   TABLE DATA           (   COPY public.tags (id, name) FROM stdin;
    public          postgres    false    215   �V       =          0    16912    users 
   TABLE DATA           �   COPY public.users (id, name, username, password, classname, grade, avatar_url, cover_image_url, created_at, updated_at) FROM stdin;
    public          postgres    false    217   W       V           0    0    comment_vote_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.comment_vote_id_seq', 10, true);
          public          postgres    false    226            W           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 14, true);
          public          postgres    false    220            X           0    0    post_tag_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.post_tag_id_seq', 173, true);
          public          postgres    false    222            Y           0    0    post_vote_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.post_vote_id_seq', 30, true);
          public          postgres    false    224            Z           0    0    posts_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.posts_id_seq', 32, true);
          public          postgres    false    218            [           0    0    tags_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.tags_id_seq', 10, true);
          public          postgres    false    214            \           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 17, true);
          public          postgres    false    216            �           2606    25419 #   alembic_version alembic_version_pkc 
   CONSTRAINT     j   ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);
 M   ALTER TABLE ONLY public.alembic_version DROP CONSTRAINT alembic_version_pkc;
       public            postgres    false    228            �           2606    16998    comment_vote comment_vote_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.comment_vote
    ADD CONSTRAINT comment_vote_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.comment_vote DROP CONSTRAINT comment_vote_pkey;
       public            postgres    false    227            �           2606    16945    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    221            �           2606    16962    post_tag post_tag_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.post_tag
    ADD CONSTRAINT post_tag_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.post_tag DROP CONSTRAINT post_tag_pkey;
       public            postgres    false    223            �           2606    16980    post_vote post_vote_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.post_vote
    ADD CONSTRAINT post_vote_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.post_vote DROP CONSTRAINT post_vote_pkey;
       public            postgres    false    225            �           2606    16930    posts posts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    219            �           2606    16910    tags tags_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
       public            postgres    false    215            �           2606    16920    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    217            �           2606    16999 )   comment_vote comment_vote_comment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment_vote
    ADD CONSTRAINT comment_vote_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id);
 S   ALTER TABLE ONLY public.comment_vote DROP CONSTRAINT comment_vote_comment_id_fkey;
       public          postgres    false    3226    227    221            �           2606    17004 &   comment_vote comment_vote_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment_vote
    ADD CONSTRAINT comment_vote_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 P   ALTER TABLE ONLY public.comment_vote DROP CONSTRAINT comment_vote_user_id_fkey;
       public          postgres    false    3222    217    227            �           2606    16946    comments comments_post_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);
 H   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_post_id_fkey;
       public          postgres    false    221    219    3224            �           2606    16951    comments comments_user_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 H   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_user_id_fkey;
       public          postgres    false    221    217    3222            �           2606    17188    post_tag post_tag_post_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.post_tag
    ADD CONSTRAINT post_tag_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.post_tag DROP CONSTRAINT post_tag_post_id_fkey;
       public          postgres    false    223    219    3224            �           2606    16968    post_tag post_tag_tag_id_fkey    FK CONSTRAINT     z   ALTER TABLE ONLY public.post_tag
    ADD CONSTRAINT post_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);
 G   ALTER TABLE ONLY public.post_tag DROP CONSTRAINT post_tag_tag_id_fkey;
       public          postgres    false    215    223    3220            �           2606    16981     post_vote post_vote_post_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.post_vote
    ADD CONSTRAINT post_vote_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);
 J   ALTER TABLE ONLY public.post_vote DROP CONSTRAINT post_vote_post_id_fkey;
       public          postgres    false    219    3224    225            �           2606    16986     post_vote post_vote_user_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.post_vote
    ADD CONSTRAINT post_vote_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 J   ALTER TABLE ONLY public.post_vote DROP CONSTRAINT post_vote_user_id_fkey;
       public          postgres    false    225    3222    217            �           2606    16931    posts posts_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_user_id_fkey;
       public          postgres    false    217    3222    219            H      x�K�433H�0OM25����� +u�      G   �   x�m���0��=E�Ul��d�9Jڦj�J���76�,R�E`ܠ�]����;��>ާJb����p��+�-���1��{R��a/m�
�8����THg3�۔j�;O��o	4�_2�э�U������:� X���������N�R��nՕj�O�PB�      A   0  x���;NA���S�G;�=oT�T�ixDI���� � !J��ٛ��n!EHS��o~�2Ѱ����GW}��B3��/��]MTS
B$�lFޟ`2���t������g$a�ǦC*�LR��_?��f����a�
��
��Ц$>J`˞���N�VL;]�p}�XL�v�P,�X1�08Y:&�,.K��Ĉi�U���p�z�y����f�.��̌i�IivG2�vߌB�"E�El�=H`����~ ���w�_Z���s�~���b���s�}�רV��d=h�&���o�Q��      C   �   x��ۍ!C�C1+B0����X�H#����v���>[vrJ	���+h;ߴ.p��]K��|@/����-�{�J�n�aA�E�# Ұ��A�-�V}T�Qr4<�$C�S�h�Fѥ
���~:Nnʲ���h����L���(5/������������J�s�
�V�@Ӏ^��#~ ��e7��������?L      E     x�m�K��@D׮S�~Ԉ��@bN0�?ǐ���.�;�H��-�؄E��2Y��"R�pl��>��l��B�>�ڰ^a��$1�q�}or�}jPH%N���7A��ێ�1��e����UEɤ厽�߄��z"�_�p2�������+���0��w�i�d��kS��Э�#=�̫/��pđ���o�gd2 ��t�.��lZ�F+nc�P�S�|?�����s~���%"�>���F�f���X���Fr�Q�a�µ�+��8צk�%�� #ں˄2Wd�2����8(���8˸<���Z�O����
��I��y���R�#�����#���|�7�T�i�>�:U)P�0c����u��{��go�z�m��mmj�}�C����쿏J�6
_�`EC=�.X�t�a�>�$T���`��V�2	��r� �Ŭ�F���}�(�y��[�u�h�����I,�e_��W�Y����5�
M�k�}�N;��k����7�Z?�vV��m��<��3�lf�>��v���)Q      ?   �  x��WM��F=k~E���_l~`/��c��";��KMFl*�\A����b�F�M$�/���A^�����4��^l��$r�ͮWU�U�ȁ������bK���礎���壂�����]ev��������̈́�d��N�;��Q;ɋv�iEl��� �h��Æ*_?t��a�����'�,mW��r������ru��Mz��+���,�Ȭ]}�HݮN	��)�X��K`۵ˇ%�����Ä������)bK���6n5p\B����/<Y����"�n��L�����^�j���|� L-��?-���v������X8�J����r�:gn�D�Z��Cɥ
1���g4��ҺL�"�GMi颠G-!�qA똺�6�q%�4�K:��&%Mx/��&�P��� ϧBP�#�#�3i�oğ��]��D�H���0�{��)lq�>�l{=�puM�,�E<e�bMM��vT�x\����%�l�(\����ܜFs����q���_#E�$�J�����2��p�i�ϓ�L����c��7�Og��'���|s����u�go8��>�d_!#�eς^8v��U�<ܒ�#D2`��|��=���󽍇2 '�1|�RO��t2�r~j��Bu��E�$Q��Khc�ٜ�á���|��w����4A�N�Z9�t�r@\ 90t�|��74�y��9�p�?���C��|�#���n�q�Ȝso[��m�
蔼�9ܑ����� ��γ���ʲ~pB���#���ߊ�
�0��Ir��!�6�� 4ć��a7n�	���\h�"&����h��b�TJ���*�R\�V�P��*/]I%&�2Br�!ǁ���]�!��L1?��FY/� �"����.��]m0�H���!rtpk�[�4Ƃ�촀�<�M187( $����O[`�^J�[�K��͏N�}�3D3!�6�,���H�6lȐ@�g$_����G	�uw�L�HU��E=k��]�Em�}|!��+a�Fj&���%϶�2�q�C�7�	���H�ߪ��q�@�f������+"���Hq�i��?�!�	�6��|������1������w�
u����)[��E����.��$�P����|g��\�4�'|tO��fy��nI,9��$OJ;8ğ�Å�B����]�˛�8ddկ 6�!%L�P	�~���^��3����`�.G0�L	;Sf۴N�*�]���*?��˨�w�5���\�~Ԛy���m��(�h�ti&F��|t2�a�|�K�q���|��Ic�уX���L���~Ći���JRb']{oD�܆�{�G�.�� ����/c��m$�y�BՏ	c�}q�{,8kzds�L
��6	�ct�j�a�N*G=�.#�T����,�t�^��3�s�-B�jqX$��c��1Hj�f�8m��"��/Q��4�ià�
�3i D�$��@n!���K���3�;�_����l���e�K�Hfd�&p0����r~B&�{�܂�ZP�����.�u0������EƗ��j�C�!)`�ZB�]��œ����~9�߃J�N0��~Tz�
�آRX�a��,�}ܱ#��އdG-�ԧR���z�m�Gis�y�3�ɿ����ܲ�/loo�?ZZ��      ;   a   x��K�0��{�A�O��E�$RW�A�����̂$������+�}�&#o��J4�+���ˑ'}�����҃/�b:bV�r�}Z���H��R      =   	  x�Փ���@���S�?v�3���]&�5�l,�-�N��R�%���"�=��$#��'>�2�]��o��l^v�_�岪
����}�=}���v?c*����1���STT� ��^����,���C[�X�+a�
k�u��͋��G�ޒ�X���Z�:(%�����޵�[/��e<���ڢ�0�x�_+� q=�N�J�A��Fh0N���l�=}������""riz�h!�F���O$�UD%�!��~��ؼ�v�il��^��+b�6a2)c��b�h��֢Q�m�2k"�m�Ou�}lD^o&��Y�Ė̹��h����ۢ�V<�C��S���.�K�c��+�}�����p���@ (Z�~����O�$�@x���	6_6��~���{�
������0DY��+H}��io��B������d]P���6�r��t�oeʪ��Jp4�篅��-�ҥ~*�P�Ic@I�+�`o���͟Ȟ鎡�ؿ�P. ����8����Zy�oWr'�$�ѡ��     