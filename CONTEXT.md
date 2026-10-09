# DIY Auto Crafter (DIY Delight) Domain Context

## Overview
DIY Auto Crafter is a custom vehicle personalizer web application that allows users to create, view, edit, and delete custom vehicle builds ("CustomCars"). Users select options across multiple feature categories, preview dynamic visual updates in real-time, see live price breakdowns, and are prevented from selecting impossible feature combinations.

## Ubiquitous Language & Domain Terms

### Entities & Data Models
- **CustomCar / CustomItem**: A user-configured vehicle build saved in the database with a custom name, selected options for each feature category, total calculated price, and timestamp.
- **FeatureCategory**: A customizable aspect of the vehicle. Examples:
  - `exteriorColor`: Paint finish applied to the vehicle body (e.g., Flame Red, Electric Blue, Midnight Black, Pearl White).
  - `wheels`: Wheel rim and tire package (e.g., 18" Sport Alloys, 20" Chrome Turbines, Off-Road All-Terrain, Track Slick Performance).
  - `roof`: Roof design configuration (e.g., Standard Hardtop, Panoramic Glass, Convertible Soft Top, Carbon Fiber Roof).
  - `interior`: Interior upholstery and trim style (e.g., Black Leather, Tan Suede, Sport Carbon, Eco Cloth).
  - `powertrain`: Engine / propulsion system (e.g., 2.0L Turbo Inline-4, 5.0L V8 Engine, Eco Dual-Electric Motor).
  - `accessories`: Add-on equipment (e.g., Roof Cargo Rack, Dual Chrome Exhaust, Rear Spoiler, Tow Hitch).

- **Option**: A specific selectable choice within a `FeatureCategory`. Each Option has:
  - `id`: Unique identifier (slug or integer).
  - `name`: Display label.
  - `price`: Additional cost added to base price ($ USD).
  - `visualValue`: Hex color code, SVG style class, or image asset reference used by the Visual Renderer.

- **ImpossibleCombo / IncompatibilityRule**: A rule dictating two options that cannot coexist on a single vehicle build.
  - Rule 1: `Convertible Soft Top` + `Roof Cargo Rack` (Cannot mount cargo rack on soft top).
  - Rule 2: `Track Slick Performance Tires` + `Off-Road Suspension / All-Terrain Wheels` (Contradictory tire/suspension setup).
  - Rule 3: `Eco Dual-Electric Motor` + `Dual Chrome Exhaust` (Electric powertrains do not have exhaust pipes).

### Financial Terms
- **BasePrice**: The standard baseline cost of a stock vehicle ($30,000 USD).
- **TotalPrice**: `BasePrice` plus the sum of all selected feature option prices.
- **PriceBreakdown**: An itemized list showing individual costs per selected option and the computed total.

### Application Roles & Operations
- **Personalizer / Builder**: The interactive UI form where options are selected, visuals update, price recalculates, and incompatibility warnings are enforced.
- **Visual Renderer**: An interactive multi-layer SVG preview component that dynamically reflects option selections (paint color fill, wheel SVG graphics, roof outlines, accessory overlays).
- **Early Validation**: Real-time client-side checks that disable incompatible option choices and alert users before form submission.
- **Server Validation**: Backend HTTP 400 rejection enforcing incompatibility constraints upon POST/PATCH API requests.
