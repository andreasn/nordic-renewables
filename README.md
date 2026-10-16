# Nordic solar & wind

A one-page dashboard of solar and wind buildout in Denmark, Finland, Norway and Sweden: installed capacity and electricity generation from 2000 to 2025, with industry estimates to 2030, plus grid-scale battery storage.

**Live site:** https://andreasn.github.io/nordic-renewables/

## Data

| File | What it holds | Source |
|---|---|---|
| `data/nordic_capacity_irena.csv` | Installed solar and wind capacity (MW), 2000–2025 | IRENA Renewable Energy Statistics 2026, via Our World in Data |
| `data/nordic_generation_eurostat.csv` | Solar and wind gross electricity production (GWh), 2000–2024 | Eurostat `nrg_bal_peh` |
| `data/nordic_outlook_2030.csv` | Industry 2030 capacity forecasts (MW) | WindEurope outlook 2026–2030 (Feb 2026); Danish Energy Agency KF26 (May 2026) for Danish solar; NVE (May 2026) for Norwegian solar; Swedish Energy Agency short-term forecast (Mar 2026) for Swedish solar; SolarPower Europe 2023, as cited by DNV (Feb 2024), for Finnish solar |
| `data/nordic_outlook_annual.csv` | Projected capacity by year, 2026–2030 (MW) | Wind: WindEurope's yearly installations added to IRENA 2025. Solar: straight line from IRENA 2025 to the 2030 forecast |
| `data/nordic_batteries_reserves_2025.csv` | Battery MW prequalified for each reserve product, 1 Jan 2025 | Nordic TSOs, *Batteries in the Nordic reserve markets* (Apr 2025) |
| `data/nordic_batteries_latest.csv` | Newest battery figure per country, with what it measures | Svenska kraftnät, Fingrid, Danish Energy Agency (via Dansk Solcelleforening), report for RME (via ESS News) |

Generation estimates for 2025–2030 are calculated in the page: each year's end-of-year capacity (IRENA for 2025, the yearly projection after that) × each country's average 2022–24 capacity factor, with a 2030 range from the weakest and strongest of those years.

## Running locally

The page loads its CSVs with `fetch`, so serve the folder rather than opening the file directly:

```sh
python3 -m http.server
```

To update the numbers, replace the CSV files, keeping the same column names.
