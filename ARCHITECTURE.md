# DIY Auto Crafter System Architecture & Call Stack Documentation

This document specifies the architectural design, directory structure, data models, and explicit 6-tier execution call stack traces for DIY Auto Crafter (Unit 4 DIY Delight Project).

---

## 1. System Architecture & Directory Structure

```
.
├── ARCHITECTURE.md                  # Detailed Call Stack Diagrams & Execution Traces
├── CONTEXT.md                       # Domain Glossary & Ubiquitous Language
├── README.md                        # Project Documentation, Checklist & Demo GIF
├── package.json                     # Root package config (workspaces or dev scripts)
├── server/                          # Backend Express & PostgreSQL Node Service
│   ├── config/
│   │   ├── database.js              # pg.Pool database connection pool & fallback
│   │   └── reset.js                 # Database schema initialization & table seeding
│   ├── controllers/
│   │   ├── carsController.js        # CRUD controllers for CustomCars
│   │   └── optionsController.js     # Fetch controllers for customizable features/options
│   ├── routes/
│   │   ├── carsRoutes.js            # Express API routes for /api/cars
│   │   └── optionsRoutes.js         # Express API routes for /api/options
│   └── server.js                    # Express application entry point & middleware setup
└── client/                          # Frontend React + Vite SPA
    ├── index.html                   # HTML Entry point
    ├── vite.config.js               # Vite configuration with API proxy
    ├── package.json                 # Frontend dependencies
    └── src/
        ├── main.jsx                 # React root render
        ├── App.jsx                  # Main App router & page layout
        ├── App.css                  # Styling
        ├── services/
        │   ├── carsAPI.js           # API HTTP client for custom car CRUD
        │   └── optionsAPI.js        # API HTTP client for customizable options
        ├── utilities/
        │   ├── calcPrice.js         # Dynamic price calculation utilities
        │   └── validation.js        # Feature combination validation logic
        ├── components/
        │   ├── CarVisualRenderer.jsx # Dynamic interactive multi-layer SVG car preview
        │   ├── Navbar.jsx           # App navigation header
        │   ├── PriceBreakdown.jsx   # Live price itemized breakdown
        │   └── IncompatibilityBadge.jsx # Early validation warning badge
        └── pages/
            ├── CreateCarPage.jsx    # Custom car creator & personalizer page
            ├── CarsListPage.jsx      # List view of all created custom cars
            ├── CarDetailPage.jsx    # Detail, edit, and delete view for a custom car
            └── EditCarPage.jsx      # Edit custom car builder page
```

---

## 2. Granular 6-Tier Execution Call Stack Diagrams

Execution traces below follow strictly 6 distinct tiers:
1. **[Project]** System / Network Boundary
2. **[Folder]** Layer / Directory Boundary
3. **[File]** Module / Component File
4. **[Class/Module]** Active Object / Handler / Component Instance
5. **[Method]** Operation Signature
6. **[State Mutability / Variable Shift]** Explicit variable values before and after operations

---

### Trace A: GET /api/cars (Fetch All Custom Cars)

```
Execution Call Stack Trace: GET /api/cars
└── [Project] HTTP Client / Browser Request (GET http://localhost:3000/api/cars)
    ├── [Configuration/Env] Invariants: PORT=3000, PGUSER="postgres", PGDATABASE="diy_delight"
    └── [Folder] server/routes/
        └── [File] server/routes/carsRoutes.js
            └── [Class/Module] Express Router (`router.get('/', carsController.getAllCars)`)
                └── [Method] carsController.getAllCars(req, res)
                    ├── [Variable State Shift] Inbound Param: req.query = {}
                    └── [Folder] server/config/
                        └── [File] server/config/database.js
                            └── [Class/Module] pg.Pool (`pool.query("SELECT * FROM custom_cars ORDER BY created_at DESC")`)
                                ├── [Variable State Shift] DB Query Executed: "SELECT * FROM custom_cars..."
                                ├── [Variable State Shift] Query Result: result.rows = [ { id: 1, name: "Sunset Cruiser", total_price: 34500, ... } ]
                                └── [Method] res.status(200).json(result.rows)
                                    └── [Project] HTTP Response Sent: Status 200 OK, Body: JSON Array of CustomCars
```

---

### Trace B: POST /api/cars (Create New Custom Car with Early Validation Check)

```
Execution Call Stack Trace: POST /api/cars
└── [Project] React SPA Client Form Submission (POST /api/cars)
    ├── [Folder] client/src/pages/
        └── [File] client/src/pages/CreateCarPage.jsx
            └── [Class/Module] React Component (`CreateCarPage`)
                └── [Method] handleSubmit(event)
                    ├── [Variable State Shift] Selected Options State:
                    │   selectedOptions = { name: "Electric Speedster", color: "blue", wheels: "slick", roof: "convertible", accessories: "exhaust" }
                    ├── [Folder] client/src/utilities/
                        └── [File] client/src/utilities/validation.js
                            └── [Method] validateCarOptions(selectedOptions)
                                ├── [Variable State Shift] Checking Rule: convertible + roof_rack => False
                                ├── [Variable State Shift] Checking Rule: electric + exhaust => True (INCOMPATIBLE!)
                                └── [Variable State Shift] Validation Return: { isValid: false, error: "Eco Dual-Electric Motor is incompatible with Dual Chrome Exhaust Pipes." }
                    └── [Folder] client/src/services/
                        └── [File] client/src/services/carsAPI.js
                            └── [Method] createCar(carData)
                                └── [Project] HTTP Request Network Hop (POST /api/cars)
                                    └── [Folder] server/routes/
                                        └── [File] server/routes/carsRoutes.js
                                            └── [Class/Module] Express Router (`router.post('/', carsController.createCar)`)
                                                └── [Method] carsController.createCar(req, res)
                                                    ├── [Variable State Shift] Inbound req.body = { name: "Electric Speedster", exterior_color: "blue", wheels: "slick", roof: "convertible", powertrain: "electric", accessories: "exhaust" }
                                                    ├── [Folder] server/controllers/
                                                        └── [File] server/controllers/carsController.js
                                                            └── [Method] validateServerCombos(carData)
                                                                ├── [Variable State Shift] Validation Check: powertrain === 'electric' && accessories === 'exhaust' => Incompatible!
                                                                └── [Method] res.status(400).json({ error: "Impossible feature combination selected: Eco Electric Powertrain cannot be combined with Dual Chrome Exhaust." })
                                                                    └── [Project] HTTP Response Sent: Status 400 Bad Request
```

*(When valid combination is submitted):*

```
                                                    ├── [Variable State Shift] Total Price Calculation:
                                                    │   base_price = 30000
                                                    │   color_price ("Flame Red") = 500
                                                    │   wheels_price ("20 Chrome") = 1200
                                                    │   roof_price ("Panoramic") = 1500
                                                    │   powertrain_price ("V8 Engine") = 3000
                                                    │   accessories_price ("Rear Spoiler") = 400
                                                    │   calculated_total = 30000 + 500 + 1200 + 1500 + 3000 + 400 = 36600
                                                    ├── [Folder] server/config/
                                                        └── [File] server/config/database.js
                                                            └── [Class/Module] pg.Pool (`pool.query("INSERT INTO custom_cars ... VALUES (...) RETURNING *")`)
                                                                ├── [Variable State Shift] DB Query Executed: INSERT INTO custom_cars (name, exterior_color, wheels, roof, interior, powertrain, accessories, total_price) ...
                                                                ├── [Variable State Shift] DB Returned Row: { id: 2, name: "V8 Thunder", total_price: 36600, ... }
                                                                └── [Method] res.status(201).json(newCar)
                                                                    └── [Project] HTTP Response Sent: Status 201 Created
```

---

### Trace C: PATCH /api/cars/:id (Update Custom Car)

```
Execution Call Stack Trace: PATCH /api/cars/:id
└── [Project] React SPA Client Edit Form Submission (PATCH /api/cars/2)
    ├── [Folder] client/src/pages/
        └── [File] client/src/pages/EditCarPage.jsx
            └── [Class/Module] React Component (`EditCarPage`)
                └── [Method] handleUpdate(carId, updatedData)
                    ├── [Variable State Shift] Inbound Edit State: id = 2, name = "V8 Thunder Spec-R", exterior_color = "red", wheels = "track_slick", roof = "carbon"
                    ├── [Folder] client/src/services/
                        └── [File] client/src/services/carsAPI.js
                            └── [Method] updateCar(id, updatedData)
                                └── [Project] HTTP Network Hop (PATCH /api/cars/2)
                                    └── [Folder] server/routes/
                                        └── [File] server/routes/carsRoutes.js
                                            └── [Class/Module] Express Router (`router.patch('/:id', carsController.updateCar)`)
                                                └── [Method] carsController.updateCar(req, res)
                                                    ├── [Variable State Shift] Params: req.params.id = "2"
                                                    ├── [Variable State Shift] Body: req.body = { name: "V8 Thunder Spec-R", exterior_color: "red", ... }
                                                    ├── [Variable State Shift] Recalculate Price: new_total_price = 38200
                                                    └── [Folder] server/config/
                                                        └── [File] server/config/database.js
                                                            └── [Class/Module] pg.Pool (`pool.query("UPDATE custom_cars SET ... WHERE id = $1 RETURNING *", [2, ...])`)
                                                                ├── [Variable State Shift] DB Updated Row: { id: 2, name: "V8 Thunder Spec-R", total_price: 38200, ... }
                                                                └── [Method] res.status(200).json(updatedCar)
                                                                    └── [Project] HTTP Response Sent: Status 200 OK
```

---

### Trace D: DELETE /api/cars/:id (Delete Custom Car)

```
Execution Call Stack Trace: DELETE /api/cars/:id
└── [Project] React SPA Client Delete Button Click (DELETE /api/cars/2)
    ├── [Folder] client/src/pages/
        └── [File] client/src/pages/CarDetailPage.jsx
            └── [Class/Module] React Component (`CarDetailPage`)
                └── [Method] handleDelete(carId)
                    ├── [Variable State Shift] Target ID: carId = 2
                    ├── [Folder] client/src/services/
                        └── [File] client/src/services/carsAPI.js
                            └── [Method] deleteCar(id)
                                └── [Project] HTTP Network Hop (DELETE /api/cars/2)
                                    └── [Folder] server/routes/
                                        └── [File] server/routes/carsRoutes.js
                                            └── [Class/Module] Express Router (`router.delete('/:id', carsController.deleteCar)`)
                                                └── [Method] carsController.deleteCar(req, res)
                                                    ├── [Variable State Shift] Params: req.params.id = "2"
                                                    └── [Folder] server/config/
                                                        └── [File] server/config/database.js
                                                            └── [Class/Module] pg.Pool (`pool.query("DELETE FROM custom_cars WHERE id = $1 RETURNING *", [2])`)
                                                                ├── [Variable State Shift] DB Result: deletedRows = [ { id: 2, name: "V8 Thunder Spec-R" } ]
                                                                └── [Method] res.status(200).json({ message: "Custom car deleted successfully", id: 2 })
                                                                    └── [Project] HTTP Response Sent: Status 200 OK
```

---

### Trace E: Client Dynamic Visual & Price Calculation State Shift

```
Execution Call Stack Trace: Real-time UI Options Selection
└── [Project] User Clicks Option Button on Interface (e.g., Select "Electric Blue" Paint)
    ├── [Folder] client/src/pages/
        └── [File] client/src/pages/CreateCarPage.jsx
            └── [Class/Module] React Component (`CreateCarPage`)
                └── [Method] handleOptionSelect(category="exteriorColor", optionId="electric_blue")
                    ├── [Variable State Shift] Previous State: selectedOptions.exteriorColor = "flame_red"
                    ├── [Variable State Shift] Updated State: selectedOptions.exteriorColor = "electric_blue"
                    ├── [Folder] client/src/utilities/
                        └── [File] client/src/utilities/calcPrice.js
                            └── [Method] calculateTotalPrice(selectedOptions, optionsCatalog)
                                ├── [Variable State Shift] Base Price: 30000
                                ├── [Variable State Shift] Option Costs Sum: 600 ("electric_blue") + 1200 ("wheels_20_chrome") + 1500 ("roof_panoramic") + 3000 ("powertrain_v8") = 6300
                                ├── [Variable State Shift] Total Price Output: 36300
                                └── [Method] setTotalPrice(36300)
                    └── [Folder] client/src/components/
                        └── [File] client/src/components/CarVisualRenderer.jsx
                            └── [Class/Module] React Component (`CarVisualRenderer`)
                                └── [Method] render(props = { options: selectedOptions })
                                    ├── [Variable State Shift] Dynamic SVG Paint Fill Attribute: SVG `<path className="car-body" fill="#0066FF" />`
                                    ├── [Variable State Shift] Dynamic SVG Wheels Layer: SVG `<g className="wheel-front"><circle r="20" stroke="#E5E7EB" /></g>`
                                    └── [Project] Browser DOM Re-render Execution Complete
```
