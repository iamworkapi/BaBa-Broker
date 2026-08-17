# Baba Broker — Backend

Express + Mongoose backend, rebuilt from the original single-file `server.mjs`
into a standard MVC-style folder structure.

## Structure

```
my-project/
├── backend/
│   ├── config/
│   │   └── db.js               # Mongoose connection + dbState.ready flag
│   ├── controllers/
│   │   ├── adminController.js  # login
│   │   ├── contactController.js
│   │   ├── propertyController.js
│   │   └── shareController.js
│   ├── middleware/
│   │   ├── adminAuth.js        # Bearer token check
│   │   ├── requireDb.js        # 503 if MongoDB isn't connected
│   │   └── errorHandler.js     # central error handler + asyncHandler wrapper
│   ├── models/
│   │   ├── Property.js
│   │   ├── Contact.js
│   │   └── Share.js
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── shareRoutes.js
│   │   └── index.js            # mounts everything under /api
│   ├── utils/
│   │   ├── seed.js             # `npm run seed` — one-off seed script
│   │   └── sampleData.json
│   └── server.js               # Express app entrypoint
├── dist/                       # Vite frontend build output (served statically)
├── dev-runner.mjs              # runs backend + `vite` dev server together
├── package.json
└── .env
```

## Setup

```bash
npm install
cp .env.example .env   # or edit the provided .env
```

Set these in `.env`:

- `PORT` — API port (default 5000)
- `MONGODB_URI` — MongoDB connection string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin login credentials
- `ADMIN_TOKEN` — bearer token issued on login (set a real random value in production)

## Run

```bash
npm run server   # backend only
npm run dev      # backend + Vite frontend dev server
npm run build    # build frontend into /dist
npm run seed     # seed one initial property if the collection is empty
```

## API

All `/api/properties`, `/api/contacts`, and `/api/shares` routes require
`Authorization: Bearer <ADMIN_TOKEN>` (obtained from `POST /api/admin/login`).

| Method | Path                     | Description          |
|--------|--------------------------|-----------------------|
| GET    | /api/health              | DB connection status |
| POST   | /api/admin/login         | Admin login           |
| GET    | /api/properties          | List properties       |
| POST   | /api/properties          | Create property        |
| PUT    | /api/properties/:id      | Update property        |
| DELETE | /api/properties/:id      | Delete property        |
| GET    | /api/contacts            | List contacts          |
| POST   | /api/contacts            | Create contact          |
| DELETE | /api/contacts/:id        | Delete contact          |
| GET    | /api/shares              | Share count             |
| POST   | /api/shares              | Create share             |
