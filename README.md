# 🧠 Quiz App

Ժամանակակից քվիզ հավելված՝ **Web + iOS + Android** պլատֆորմների համար։ Սովորեք նոր բաներ տարբեր ոլորտներից՝ Մաթեմատիկա, Պատմություն, Ծրագրավորում, Անգլերեն և ավելին։

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Հատկություններ

- 🔐 **Անվտանգ auth** — գրանցում և մուտք email-ով (Supabase Auth)
- 📚 **Բազմաթիվ ոլորտներ** — Մաթեմատիկա, Պատմություն, Ծրագրավորում, Անգլերեն
- ⏱️ **Timed թեստեր** — ամեն թեստ ունի ժամանակի սահմանափակում
- 📊 **Արդյունքների վերլուծություն** — տոկոս, միավորներ, ամսաթիվ
- 📜 **Պատմություն** — տեսեք ձեր բոլոր նախորդ թեստերը
- 🎨 **Գեղեցիկ UI** — gradient-ներ, shadows, animations
- 📱 **Cross-platform** — աշխատում է web-ում, iOS-ում, Android-ում
- 🌙 **Dark mode** *(շուտով)*

---

## 🛠️ Տեխնոլոգիաներ

### Frontend
- **Expo SDK 57** — cross-platform framework
- **React Native 0.86** — mobile UI
- **React Native Web** — web support
- **Expo Router** — file-based navigation
- **TypeScript** — type safety
- **Expo Linear Gradient** — գեղեցիկ gradient-ներ

### Backend
- **Supabase** — PostgreSQL DB + Auth + REST API
- **Row Level Security (RLS)** — տվյալների պաշտպանություն

### State Management
- **React Context** — auth state
- **AsyncStorage** — session-ի պահպանում

---

## 📸 Սքրինշոթներ

| Login | Categories | Test |
|-------|-----------|------|
| ![Login](https://via.placeholder.com/200x400/6366F1/ffffff?text=Login) | ![Categories](https://via.placeholder.com/200x400/8B5CF6/ffffff?text=Categories) | ![Test](https://via.placeholder.com/200x400/EC4899/ffffff?text=Test) |

| Result | History | Profile |
|--------|---------|---------|
| ![Result](https://via.placeholder.com/200x400/10B981/ffffff?text=Result) | ![History](https://via.placeholder.com/200x400/F59E0B/ffffff?text=History) | ![Profile](https://via.placeholder.com/200x400/3B82F6/ffffff?text=Profile) |

---

## 🚀 Սկսել

### Նախապայմաններ

- **Node.js** ≥ 18 ([nodejs.org](https://nodejs.org))
- **npm** կամ **yarn**
- **Git**
- **Supabase** հաշիվ ([supabase.com](https://supabase.com))

### 1. Clone արեք repository-ն

```bash
git clone https://github.com/YOUR_USERNAME/quiz-app.git
cd quiz-app
```

### 2. Տեղադրեք փաթեթները

```bash
npm install
```

### 3. Կարգավորեք Supabase-ը

#### 3.1. Ստեղծեք նախագիծ

1. Գնացեք [supabase.com](https://supabase.com) → **New Project**
2. Անունը՝ `quiz-app`
3. Սպասեք 1-2 րոպե

#### 3.2. Ստեղծեք DB schema

Բացեք **SQL Editor** → **New query** և գործարկեք.

```sql
-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text,
  created_at timestamptz default now()
);

-- Tests
create table tests (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  title text not null,
  description text,
  time_limit int default 600,
  created_at timestamptz default now()
);

-- Questions
create table questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  text text not null,
  options jsonb not null,
  correct_index int not null,
  points int default 1,
  position int not null
);

-- Results
create table results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  test_id uuid references tests(id) on delete cascade,
  score int not null,
  total int not null,
  answers jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table categories enable row level security;
alter table tests enable row level security;
alter table questions enable row level security;
alter table results enable row level security;

create policy "read categories" on categories for select using (true);
create policy "read tests" on tests for select using (true);
create policy "read questions" on questions for select using (true);
create policy "own results read" on results for select using (auth.uid() = user_id);
create policy "own results insert" on results for insert with check (auth.uid() = user_id);
```

#### 3.3. Ավելացրեք seed տվյալներ

```sql
insert into categories (name, slug, icon) values
  ('Մաթեմատիկա', 'math', '🔢'),
  ('Պատմություն', 'history', '📜'),
  ('Ծրագրավորում', 'programming', '💻'),
  ('Անգլերեն', 'english', '🇬🇧');

insert into tests (category_id, title, description, time_limit)
select id, 'Հանրահաշվի հիմունքներ', 'Պարզ թեստ սկսնակների համար', 300
from categories where slug = 'math';

insert into questions (test_id, text, options, correct_index, position)
select id, 'Ինչի՞ է հավասար 2 + 2 × 2', '["4","6","8","10"]'::jsonb, 1, 1
from tests where title = 'Հանրահաշվի հիմունքներ';
```

#### 3.4. Կարգավորեք Authentication-ը

**Authentication → Providers → Email**.

- ✅ **Enable Email provider**
- ❌ **Confirm email** → **OFF** (փորձարկման համար)

#### 3.5. Ստացեք API keys

**Settings → API**.

- `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
- `anon public key` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 4. Ստեղծեք `.env` ֆայլ

Նախագծի արմատում ստեղծեք **`.env`** ֆայլ.

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **`.env` ֆայլը չպետք է commit արվի Git-ում։** Համոզվեք, որ `.gitignore`-ում կա `.env`։

### 5. Գործարկեք

```bash
# Web
npm run web

# Բոլոր պլատֆորմները
npm start

# Android
npm run android

# iOS (միայն Mac)
npm run ios
```

Բրաուզերում բացվում է `http://localhost:8081`։

---

## 📁 Նախագծի կառուցվածք

```
quiz-app/
├── app/                          # Expo Router էկրաններ
│   ├── _layout.tsx              # Root layout + auth guard
│   ├── (auth)/                  # Անհայտ օգտատերերի համար
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                  # Հիմնական հավելված
│   │   ├── _layout.tsx          # Tabs նավիգացիա
│   │   ├── index.tsx            # Ոլորտներ
│   │   ├── history.tsx          # Պատմություն
│   │   └── profile.tsx          # Պրոֆիլ
│   ├── category/
│   │   └── [slug].tsx           # Թեստերի ցանկ
│   └── test/
│       ├── [id].tsx             # Թեստի անցում
│       └── [id]-result.tsx      # Արդյունք
├── components/                   # Վերաօգտագործվող UI
│   ├── GradientButton.tsx
│   ├── Input.tsx
│   └── Screen.tsx
├── lib/                          # Utilities
│   ├── supabase.ts              # Supabase client
│   ├── auth-context.tsx         # Auth provider
│   └── theme.ts                 # Design system
├── assets/                       # Նկարներ, ֆոնտեր
├── .env                          # Գաղտնիքներ (չի commit)
├── .gitignore
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Design System

Ամբողջ UI-ը կառուցված է **`lib/theme.ts`**-ի վրա։

### Գույներ

| Անուն | Hex | Կիրառություն |
|-------|-----|--------------|
| `primary` | `#6366F1` | Indigo — հիմնական |
| `accent` | `#8B5CF6` | Violet — gradient |
| `success` | `#10B981` | Կանաչ — հաջողություն |
| `warning` | `#F59E0B` | Դեղին — զգուշացում |
| `danger` | `#EF4444` | Կարմիր — սխալ |

### Typography

- **H1** — 32px, weight 800
- **H2** — 24px, weight 700
- **Body** — 16px, weight 400
- **Small** — 14px, weight 400

### Spacing

`xs: 4` · `sm: 8` · `md: 12` · `lg: 16` · `xl: 20` · `xxl: 24` · `xxxl: 32`

---

## 🗄️ Տվյալների բազայի սխեմա

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ categories  │──┐    │   tests     │──┐    │  questions  │
│─────────────│  │    │─────────────│  │    │─────────────│
│ id          │  └───▶│ category_id │  └───▶│ test_id     │
│ name        │       │ id          │       │ id          │
│ slug        │       │ title       │       │ text        │
│ icon        │       │ description │       │ options     │
└─────────────┘       │ time_limit  │       │ correct_idx │
                      └─────────────┘       │ position    │
                                            └─────────────┘

┌─────────────┐       ┌─────────────┐
│   users     │       │   results   │
│─────────────│       │─────────────│
│ id (auth)   │──┐    │ id          │
│ email       │  └───▶│ user_id     │
└─────────────┘       │ test_id     │
                      │ score       │
                      │ total       │
                      │ answers     │
                      │ created_at  │
                      └─────────────┘
```

---

## 🔐 Անվտանգություն

- **Row Level Security (RLS)** — յուրաքանչյուր օգտատեր տեսնում է միայն իր արդյունքները
- **JWT tokens** — Supabase-ի կողմից ավտոմատ կառավարվող
- **Session persistence** — AsyncStorage-ի միջոցով
- **Environment variables** — գաղտնիքները `.env`-ում, ոչ կոդում

---

## 🌐 Deploy

### Web — Vercel

```bash
# 1. Build
npx expo export -p web

# 2. Deploy
npm install -g vercel
vercel --prod
```

Կամ կապեք GitHub repo-ն [vercel.com](https://vercel.com)-ին → ավտոմատ deploy ամեն push-ի ժամանակ։

### Mobile — EAS Build

```bash
# Տեղադրեք EAS CLI
npm install -g eas-cli

# Login
eas login

# Config
eas build:configure

# Build APK/IPA
eas build --platform android
eas build --platform ios
```

---

## 🧪 Ինչպես ավելացնել նոր թեստ

1. **Supabase Dashboard → Table Editor → tests**
2. **Insert row**.
   - `category_id` — ոլորտի ID
   - `title` — թեստի անուն
   - `description` — նկարագրություն
   - `time_limit` — ժամանակ վայրկյաններով (օր. 600 = 10 րոպե)
3. **Table Editor → questions** → ավելացրեք հարցեր.
   - `test_id` — թեստի ID
   - `text` — հարց
   - `options` — `["A","B","C","D"]`
   - `correct_index` — 0, 1, 2, կամ 3
   - `position` — հերթականություն

---

## 🛣️ Roadmap

- [x] Auth (գրանցում / մուտք / logout)
- [x] Ոլորտների էկրան
- [x] Թեստերի անցում
- [x] Արդյունքների ցուցադրում
- [x] Պատմություն
- [x] Պրոֆիլ
- [ ] Leaderboard (վարկանիշ)
- [ ] Թեստերի որոնում
- [ ] Սիրելիներ
- [ ] Dark mode
- [ ] Push notifications
- [ ] Թեստերի ստեղծում օգտատերերի կողմից
- [ ] Պրեմիում բաժանորդագրություն (Stripe)
- [ ] Social sharing
- [ ] Բազմալեզու աջակցություն

---

## 🤝 Ներդրում

Contributions-ը ողջունելի են։

1. Fork արեք project-ը
2. Ստեղծեք feature branch. `git checkout -b feature/amazing`
3. Commit արեք. `git commit -m 'Add amazing feature'`
4. Push արեք. `git push origin feature/amazing`
5. Բացեք Pull Request

---

## 📄 License

Այս նախագիծը լիցենզավորված է **MIT License**-ով — տեսեք [LICENSE](LICENSE) ֆայլը։

---

## 🙏 Շնորհակալություն

- [Expo](https://expo.dev) — cross-platform framework
- [Supabase](https://supabase.com) — backend
- [React Native](https://reactnative.dev) — mobile UI

---

## 📞 Կապ

- **Հեղինակ.** Ձեր Անունը
- **GitHub.** [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- **Email.** your@email.com

---

<p align="center">
  <strong>🧠 Quiz App</strong> — Սովորեք խաղալով 🎮
</p>

<p align="center">
  Made with ❤️ in Armenia 🇦🇲
</p>
